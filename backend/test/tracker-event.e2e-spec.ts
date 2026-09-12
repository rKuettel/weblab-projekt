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

  async function insertTracker(
    type: 'counter' | 'category' = 'counter',
  ): Promise<ObjectId> {
    const _id = new ObjectId();
    await trackers.insertOne({
      _id,
      name: 'Steps',
      type,
      summary: {
        sum: 0,
      },
    });
    return _id;
  }

  async function insertCounterEvent(
    trackerId: ObjectId,
    delta: number,
    timestamp: Date,
  ): Promise<ObjectId> {
    const _id = new ObjectId();
    await events.insertOne({
      _id,
      trackerId,
      timestamp,
      data: { delta },
    });
    return _id;
  }

  async function insertCategoryEvent(
    trackerId: ObjectId,
    category: string,
    amount: number,
    timestamp: Date,
  ): Promise<ObjectId> {
    const _id = new ObjectId();
    await events.insertOne({
      _id,
      trackerId,
      timestamp,
      data: {
        category,
        amount,
      },
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
          data: { delta: 5 },
        })
        .expect(201);

      expect(response.body).toEqual({
        id: String(trackerId),
        name: 'Steps',
        type: 'counter',
        summary: { sum: 5 },
      });

      const stored = await events.findOne({ trackerId });
      expect(stored).toMatchObject({
        data: { delta: 5 },
      });
      expect(stored?.timestamp).toEqual(new Date('2024-01-01T02:00:00.000Z'));
    });

    it('creates a category event and returns the tracker with updated summary', async () => {
      const trackerId = await insertTracker('category');

      const response = await request(app.getHttpServer())
        .post(`/tracker/${trackerId}/event`)
        .send({
          timestamp: '2024-01-01T02:00:00.000Z',
          data: { category: 'Drinks', amount: 5 },
        })
        .expect(201);

      expect(response.body).toEqual({
        id: String(trackerId),
        name: 'Steps',
        type: 'category',
        summary: [{ category: 'Drinks', amount: 5 }],
      });

      const stored = await events.findOne({ trackerId });
      expect(stored).toMatchObject({
        data: { category: 'Drinks', amount: 5 },
      });
      expect(stored?.timestamp).toEqual(new Date('2024-01-01T02:00:00.000Z'));
    });
  });

  describe('GET /tracker/:trackerId/event', () => {
    it('returns all events of the tracker', async () => {
      const trackerId = await insertTracker();
      await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T01:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        7,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: expect.any(String),
            timestamp: '2024-01-01T01:00:00.000Z',
            data: { delta: 5 },
          },
          {
            id: expect.any(String),
            timestamp: '2024-01-01T02:00:00.000Z',
            data: { delta: 7 },
          },
        ]),
      );
    });

    it('only returns events of the requested tracker', async () => {
      const trackerId = await insertTracker();
      const otherId = await insertTracker();
      await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T01:00:00.000Z'),
      );
      await insertCounterEvent(
        otherId,
        9,
        new Date('2024-01-01T01:00:00.000Z'),
      );

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].data).toEqual({ delta: 5 });
    });

    it('filters events from the given date onwards (inclusive)', async () => {
      const trackerId = await insertTracker();
      await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T01:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        7,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        11,
        new Date('2024-01-01T03:00:00.000Z'),
      );

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
      await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T01:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        7,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        11,
        new Date('2024-01-01T03:00:00.000Z'),
      );

      const response = await request(app.getHttpServer())
        .get(`/tracker/${trackerId}/event`)
        .query({ to: '2024-01-01T02:00:00.000Z' })
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].data).toEqual({ delta: 5 });
    });

    it('filters events between from and to', async () => {
      const trackerId = await insertTracker();
      await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T01:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        7,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        11,
        new Date('2024-01-01T03:00:00.000Z'),
      );

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
    it('deletes counter event and decrements the tracker summary', async () => {
      const trackerId = await insertTracker();
      const eventId = await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCounterEvent(
        trackerId,
        6,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(1);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toEqual({ sum: 6 });
    });

    it('deletes counter event when last event of tracker sets summary to 0', async () => {
      const trackerId = await insertTracker();
      const eventId = await insertCounterEvent(
        trackerId,
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(0);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toEqual({ sum: 0 });
    });

    it('deletes category event and decrements category in summary', async () => {
      const trackerId = await insertTracker('category');
      const eventId = await insertCategoryEvent(
        trackerId,
        'Drinks',
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCategoryEvent(
        trackerId,
        'Drinks',
        6,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(1);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toEqual([{ category: 'Drinks', amount: 6 }]);
    });

    it('deletes category event when last event of tracker sets summary to empty list', async () => {
      const trackerId = await insertTracker('category');
      const eventId = await insertCategoryEvent(
        trackerId,
        'Drinks',
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(0);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toEqual([]);
    });

    it('deletes category event when last event of category removes category from tracker summary', async () => {
      const trackerId = await insertTracker('category');
      const eventId = await insertCategoryEvent(
        trackerId,
        'Drinks',
        5,
        new Date('2024-01-01T02:00:00.000Z'),
      );
      await insertCategoryEvent(
        trackerId,
        'Food',
        6,
        new Date('2024-01-01T02:00:00.000Z'),
      );

      await request(app.getHttpServer())
        .delete(`/tracker/${trackerId}/event/${eventId}`)
        .expect(200);

      expect(await events.countDocuments({})).toBe(1);
      const tracker = await trackers.findOne({ _id: trackerId });
      expect(tracker?.summary).toEqual([{ category: 'Food', amount: 6 }]);
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
