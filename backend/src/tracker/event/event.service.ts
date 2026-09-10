import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { Tracker } from '../schemas/tracker.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TrackerEvent } from './schemas/event.schemas.js';
import { ObjectId } from 'mongodb';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
    @InjectModel(TrackerEvent.name) private eventModel: Model<TrackerEvent>,
  ) {}

  async create(trackerId: string, createEventDto: CreateEventDto) {
    const event = new this.eventModel({
      trackerId,
      ...createEventDto,
    });
    await event.save();
    return this.refreshSummary(trackerId);
  }

  async findInRange(trackerId: string, from?: Date, to?: Date) {
    const timestamp: Record<string, Date> = {
      ...(from && { $gte: from }),
      ...(to && { $lt: to }),
    };

    return this.eventModel
      .find({ trackerId, ...(from || to ? { timestamp } : {}) })
      .exec();
  }

  async remove(trackerId: string, id: string) {
    const event = await this.eventModel.findByIdAndDelete(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (event.type !== 'counter') {
      throw new Error('Unkown event type');
    }
    return this.refreshSummary(trackerId);
  }

  private async refreshSummary(trackerId: string) {
    const [result] = await this.eventModel
      .aggregate([
        { $match: { trackerId: new ObjectId(trackerId) } },
        {
          $group: {
            _id: null,
            sum: { $sum: '$data.delta' },
          },
        },
      ])
      .exec();

    return await this.trackerModel.findByIdAndUpdate(
      trackerId,
      {
        summary: result?.sum ?? 0,
      },
      {
        returnDocument: 'after',
      },
    );
  }
}
