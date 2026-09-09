import { Module } from '@nestjs/common';
import { EventService } from './event.service.js';
import { EventController } from './event.controller.js';
import { Tracker, TrackerSchema } from '../schemas/tracker.schema.js';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackerEvent, TrackerEventSchema } from './schemas/event.schemas.js';

@Module({
  controllers: [EventController],
  imports: [
    MongooseModule.forFeature([
      { name: Tracker.name, schema: TrackerSchema },
      { name: TrackerEvent.name, schema: TrackerEventSchema },
    ]),
  ],
  providers: [EventService],
})
export class EventModule {}
