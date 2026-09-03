import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto.js';
import { UpdateTrackerDto } from './dto/update-tracker.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tracker } from './schemas/tracker.schema.js';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
  ) {}

  create(createTrackerDto: CreateTrackerDto) {
    const createdTracker = new this.trackerModel(createTrackerDto);
    return createdTracker.save();
  }

  findAll() {
    return this.trackerModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} tracker`;
  }

  update(id: number, updateTrackerDto: UpdateTrackerDto) {
    return `This action updates a #${id} tracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracker`;
  }
}
