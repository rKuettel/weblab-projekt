import request from 'supertest';
import { MongoClient, ObjectId } from 'mongodb';
import { Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types.js';
import { AppModule, DB_NAME } from '../src/app.module.js';
import { Test, TestingModule } from '@nestjs/testing';
import { Tracker } from '../src/tracker/schemas/tracker.schema.js';
import { TrackerEvent } from '../src/tracker/event/schemas/event.schemas.js';

describe('tracker API (e2e)', () => {
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

  describe('', () => {
    it('creates a tracker and returns it with a generated id', async () => {
      const response = await request(app.getHttpServer())
        .post('/tracker')
        .send({ name: 'Steps', type: 'counter' })
        .expect(201);

      expect(response.body.id).toMatch(/^[a-f0-9]{24}$/);
      expect(response.body).toEqual({
        id: response.body.id,
        name: 'Steps',
        type: 'counter',
        summary: 0,
      });
    });
  });

  describe('GET /tracker', () => {
    it('responds with an empty list when there are no trackers', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracker')
        .expect(200);
      expect(response.body).toEqual([]);
    });

    it('lists all trackers', async () => {
      await trackers.insertMany([
        { name: 'Steps', type: 'counter', summary: 10 },
        { name: 'Mood', type: 'category', summary: 0 },
      ]);

      const response = await request(app.getHttpServer())
        .get('/tracker')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: 'Steps',
            type: 'counter',
            summary: 10,
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: 'Mood',
            type: 'category',
            summary: 0,
          }),
        ]),
      );
    });
  });

  describe('GET /tracker/:id', () => {
    it('returns a single tracker', async () => {
      const id = new ObjectId();
      await trackers.insertOne({
        _id: id,
        name: 'Steps',
        type: 'counter',
        summary: 10,
      });

      const response = await request(app.getHttpServer())
        .get(`/tracker/${id}`)
        .expect(200);
      expect(response.body).toEqual({
        id: String(id),
        name: 'Steps',
        type: 'counter',
        summary: 10,
      });
    });

    it('responds with 404 for an unknown id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tracker/${new ObjectId()}`)
        .expect(404);
      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Not Found',
      });
    });
  });

  describe('PATCH /tracker/:id', () => {
    it('updates the tracker and returns it', async () => {
      const id = new ObjectId();
      await trackers.insertOne({
        _id: id,
        name: 'Steps',
        type: 'counter',
        summary: 10,
      });

      const response = await request(app.getHttpServer())
        .patch(`/tracker/${id}`)
        .send({ name: 'Daily Steps' })
        .expect(200);

      expect(response.body).toEqual({
        id: String(id),
        name: 'Daily Steps',
        type: 'counter',
        summary: 10,
      });
    });

    it('responds with 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .patch(`/tracker/${new ObjectId()}`)
        .send({ name: 'Daily Steps' })
        .expect(404);
    });
  });

  describe('DELETE /tracker/:id', () => {
    it('deletes the tracker and its events', async () => {
      const id = new ObjectId();
      await trackers.insertOne({
        _id: id,
        name: 'Steps',
        type: 'counter',
        summary: 20,
      });
      await events.insertMany([
        {
          trackerId: id,
          timestamp: new Date('2024-01-01T01:00:00.000Z'),
          type: 'counter',
          data: { delta: 10 },
        },
        {
          trackerId: id,
          timestamp: new Date('2024-01-01T02:00:00.000Z'),
          type: 'counter',
          data: { delta: 10 },
        },
      ]);

      await request(app.getHttpServer()).delete(`/tracker/${id}`).expect(200);

      expect(await trackers.countDocuments({ _id: id })).toBe(0);
      expect(await events.countDocuments({ trackerId: id })).toBe(0);
    });

    it('responds with 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .delete(`/tracker/${new ObjectId()}`)
        .expect(404);
    });
  });
});
