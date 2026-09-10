import request from 'supertest';
import { MongoClient, ObjectId } from 'mongodb';
import type { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Tracker } from '../src/tracker/schemas/tracker.schema.js';
import { TrackerEvent } from '../src/tracker/event/schemas/event.schemas.js';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule, DB_NAME } from '../src/app.module.js';

describe('tracker event API (e2e)', () => {
  let mongo: MongoMemoryServer;
  let client: MongoClient;
  let trackers: Collection<Tracker>;
  let events: Collection<TrackerEvent>;
  let app: INestApplication<App>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    client = await MongoClient.connect(process.env.MONGODB_URI);
    trackers = client.db(DB_NAME).collection<Tracker>('trackers');
    events = client.db(DB_NAME).collection<TrackerEvent>('trackerevents');
  });

  afterAll(async () => {
    await client?.close();
    await mongo?.stop();
    delete process.env.DB_URI;
  });

  beforeEach(async () => {
    await events.deleteMany();
    await trackers.deleteMany();
  });

  async function insertTracker(): Promise<ObjectId> {
    const _id = new ObjectId();
    await trackers.insertOne({
      _id,
      name: 'Steps',
      type: 'counter',
      summary: 0,
    });
    return _id;
  }

  async function insertEvent(
    trackerId: ObjectId,
    delta: number,
    timestamp: Date,
  ): Promise<ObjectId> {
    const _id = new ObjectId();
    await events.insertOne({
      _id,
      trackerId,
      timestamp,
      type: 'counter',
      data: { delta },
    });
    return _id;
  }

  describe('POST /tracker/:trackerId/event', () => {
    it('creates a counter event and returns the tracker with the incremented summary', async () => {
      const trackerId = await insertTracker();

      const response = await request(app.getHttpServer())
        .post(`/tracker/${trackerId}/event`)
        .send({
          timestamp: '2024-01-01T02:00:00.000Z',
          type: 'counter',
          data: { delta: 5 },
        })
        .expect(201);

      expect(response.body).toEqual({
        id: String(trackerId),
        name: 'Steps',
        type: 'counter',
        summary: 5,
      });

      const stored = await events.findOne({ trackerId });
      expect(stored).toMatchObject({
        type: 'counter',
        data: { delta: 5 },
      });
      expect(stored?.timestamp).toEqual(new Date('2024-01-01T02:00:00.000Z'));
    });
  });

  describe('GET /tracker/:trackerId/event', () => {
    it('returns all events of the tracker', async () => {
      const trackerId = await insertTracker();
      await insertEvent(trackerId, 5, new Date('2024-01-01T01:00:00.000Z'));
      await insertEvent(trackerId, 7, new Date('2024-01-01T02:00:00.000Z'));

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(String),
            type: 'counter',
            timestamp: '2024-01-01T01:00:00.000Z',
            data: { delta: 5 },
          },
          {
            id: expect.any(String),
            type: 'counter',
            timestamp: '2024-01-01T02:00:00.000Z',
            data: { delta: 7 },
          },
        ]),
      );
    });

    it('only returns events of the requested tracker', async () => {
      const trackerId = await insertTracker();
      const otherId = await insertTracker();
      await insertEvent(trackerId, 5, new Date('2024-01-01T01:00:00.000Z'));
      await insertEvent(otherId, 9, new Date('2024-01-01T01:00:00.000Z'));

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].data).toEqual({ delta: 5 });
    });

    it('filters events from the given date onwards (inclusive)', async () => {
      const trackerId = await insertTracker();
      await insertEvent(trackerId, 5, new Date('2024-01-01T01:00:00.000Z'));
      await insertEvent(trackerId, 7, new Date('2024-01-01T02:00:00.000Z'));
      await insertEvent(trackerId, 11, new Date('2024-01-01T03:00:00.000Z'));

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .query({ from: '2024-01-01T02:00:00.000Z' })
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(
        response.body.map(
          (event: { data: { delta: number } }) => event.data.delta,
        ),
      ).toEqual([7, 11]);
    });

    it('filters events until the given date (exclusive)', async () => {
      const trackerId = await insertTracker();
      await insertEvent(trackerId, 5, new Date('2024-01-01T01:00:00.000Z'));
      await insertEvent(trackerId, 7, new Date('2024-01-01T02:00:00.000Z'));
      await insertEvent(trackerId, 11, new Date('2024-01-01T03:00:00.000Z'));

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .query({ to: '2024-01-01T02:00:00.000Z' })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].data).toEqual({ delta: 5 });
    });

    it('filters events between from and to', async () => {
      const trackerId = await insertTracker();
      await insertEvent(trackerId, 5, new Date('2024-01-01T01:00:00.000Z'));
      await insertEvent(trackerId, 7, new Date('2024-01-01T02:00:00.000Z'));
      await insertEvent(trackerId, 11, new Date('2024-01-01T03:00:00.000Z'));

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .query({
          from: '2024-01-01T01:30:00.000Z',
          to: '2024-01-01T03:00:00.000Z',
        })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].data).toEqual({ delta: 7 });
    });
  });

  describe('DELETE /tracker/:trackerId/event/:id', () => {
    it('deletes the event and decrements the tracker summary', async () => {
      const trackerId = await insertTracker();
      const eventId = await insertEvent(
        trackerId,
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertEvent(trackerId, 6, new Date('2024-01-01T02:00:00.000Z'));

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(1);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toBe(6);
    });

    it('deletes the event when last event of tracker sets summary to 0', async () => {
      const trackerId = await insertTracker();
      const eventId = await insertEvent(
        trackerId,
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(0);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toBe(0);
    });

    it('responds with 404 for an unknown event id', async () => {
      const trackerId = await insertTracker();
      const unknownId = new ObjectId();

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${unknownId}`)
        .expect(404);
    });
  });
});
