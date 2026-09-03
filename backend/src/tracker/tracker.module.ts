import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service.js';
import { TrackerController } from './tracker.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracker, TrackerSchema } from './schemas/tracker.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tracker.name, schema: TrackerSchema }]),
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
