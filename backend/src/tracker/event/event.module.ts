import { Module } from '@nestjs/common';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';
import { TrackerModule } from '../tracker.module.js';
import { Tracker, TrackerSchema } from '../schemas/tracker.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schemas.js';
import { Mongoose } from 'mongoose';
import { TrackerService } from '../tracker.service.js';

@Module({
  controllers: [EventController],
  imports: [
    MongooseModule.forFeature([
      { name: Tracker.name, schema: TrackerSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    MongooseModule.forFeature([]),
  ],
  providers: [EventService],
})
export class EventModule {}
