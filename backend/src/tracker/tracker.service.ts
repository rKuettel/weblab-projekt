import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto.js';
import { UpdateTrackerDto } from './dto/update-tracker.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tracker } from './schemas/tracker.schema.js';
import { TrackerEvent } from './event/schemas/event.schemas.js';

@Injectable()
export class TrackerService {
  constructor(
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
    return this.trackerModel.findByIdAndUpdate(id, updateTrackerDto, {
      returnDocument: 'after',
    });
  }

  async remove(id: string) {
    const tracker = await this.trackerModel.findById(id).exec();
    if (!tracker) {
      throw new NotFoundException();
    }
    await tracker.deleteOne().exec();
    await this.eventModel.deleteMany({ trackerId: id }).exec();
  }
}
