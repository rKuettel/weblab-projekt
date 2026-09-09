import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service.js';
import { TrackerController } from './tracker.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracker, TrackerSchema } from './schemas/tracker.schema.js';
import { EventModule } from './event/event.module.js';
import {
  TrackerEvent,
  TrackerEventSchema,
} from './event/schemas/event.schemas.js';

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      { name: Tracker.name, schema: TrackerSchema },
      { name: TrackerEvent.name, schema: TrackerEventSchema },
    ]),
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
