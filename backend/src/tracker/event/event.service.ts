import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import {
  CategoryTrackerSummary,
  CounterTrackerSummary,
  Tracker,
  TrackerDocument,
  TrackerSummary,
} from '../schemas/tracker.schema.js';
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
    const tracker = await this.trackerModel.findById(trackerId).exec();
    if (!tracker) {
      throw new NotFoundException(`Tracker with id ${trackerId} not found`);
    }
    const event = new this.eventModel({
      trackerId,
      ...createEventDto,
    });
    await event.save();
    return this.refreshSummary(tracker);
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
    const tracker = await this.trackerModel.findById(trackerId).exec();
    if (!tracker) {
      throw new NotFoundException(`Tracker with id ${trackerId} not found`);
    }
    const event = await this.eventModel.findByIdAndDelete(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return this.refreshSummary(tracker);
  }

  private async refreshSummary(tracker: TrackerDocument) {
    const updatedSummary = await this.calculateSummary(tracker);

    tracker.summary = updatedSummary;
    tracker.markModified('summary');

    return await tracker.save();
  }

  private async calculateSummary(
    tracker: TrackerDocument,
  ): Promise<TrackerSummary> {
    switch (tracker.type) {
      case 'counter':
        return await this.calculateCounterSummary(tracker.id);
      case 'category':
        return await this.calculateCategorySummary(tracker.id);
    }
  }

  private async calculateCounterSummary(
    trackerId: string,
  ): Promise<CounterTrackerSummary> {
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

    return {
      sum: result?.sum ?? 0,
    };
  }
  private async calculateCategorySummary(
    trackerId: string,
  ): Promise<CategoryTrackerSummary> {
    const rows = await this.eventModel.aggregate([
      { $match: { trackerId: new ObjectId(trackerId) } },
      {
        $group: {
          _id: '$data.category',
          amount: { $sum: '$data.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          amount: 1,
        },
      },
    ]);
    return rows ?? {};
  }
}
