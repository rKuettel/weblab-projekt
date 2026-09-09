import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto.js';
import { UpdateTrackerDto } from './dto/update-tracker.dto.js';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { Model } from 'mongoose';
import { Tracker } from './schemas/tracker.schema.js';
import { TrackerEvent } from './event/schemas/event.schemas.js';

@Injectable()
export class TrackerService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
    @InjectModel(TrackerEvent.name) private eventModel: Model<TrackerEvent>,
  ) {}

  create(createTrackerDto: CreateTrackerDto) {
    const createdTracker = new this.trackerModel(createTrackerDto);
    return createdTracker.save();
  }

  findAll() {
    return this.trackerModel.find().exec();
  }

  findOne(id: string) {
    return this.trackerModel.findById(id).exec();
  }

  async update(id: string, updateTrackerDto: UpdateTrackerDto) {
    // const tracker = await this.trackerModel.findById(id).exec();
    // if (!tracker) {
    //   throw new NotFoundException();
    // }

    return this.trackerModel.findByIdAndUpdate(id, updateTrackerDto, {
      returnDocument: 'after',
    });
    // return tracker.updateOne(updateTrackerDto, { new: true }).exec();
    // return await this.trackerModel.findById(id).exec();
  }

  async remove(id: string) {
    const tracker = await this.trackerModel.findById(id).exec();
    if (!tracker) {
      throw new NotFoundException();
    }
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        this.eventModel.deleteMany({ trackerId: id }).exec();
        tracker.deleteOne().exec();
      });
    } finally {
      session.endSession();
    }
  }
}
