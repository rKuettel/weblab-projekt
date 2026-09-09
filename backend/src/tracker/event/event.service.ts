import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { Tracker } from '../schemas/tracker.schema.js';
import { Model } from 'mongoose';
import type { Connection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CounterEvent, TrackerEvent } from './schemas/event.schemas.js';

@Injectable()
export class EventService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
    @InjectModel(TrackerEvent.name) private eventModel: Model<TrackerEvent>,
  ) {}

  async create(trackerId: string, createEventDto: CreateEventDto) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const createdEvent = new this.eventModel({
          trackerId,
          ...createEventDto,
        });

        await createdEvent.save();

        return this.trackerModel.updateOne(
          { _id: trackerId },
          {
            $inc: {
              summary: createEventDto.data.delta,
            },
          },
        );
      });
    } finally {
      session.endSession();
    }

    return this.trackerModel.findById(trackerId).exec();
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
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    if (event.type !== 'counter') {
      throw new Error('Unkown event type');
    }
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const data = event.data as CounterEvent;
        this.trackerModel
          .updateOne(
            { _id: trackerId },
            {
              $inc: {
                summary: -data.delta,
              },
            },
          )
          .exec();

        event.deleteOne().exec();
      });
    } finally {
      session.endSession();
    }
  }
}
