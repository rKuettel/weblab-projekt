import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { Tracker } from '../schemas/tracker.schema.js';
import { Model } from 'mongoose';
import type { Connection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
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

  findAll(trackerId: string) {
    return this.eventModel.find({ trackerId: trackerId }).exec();
  }

  update(trackerId: string, id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(trackerId: string, id: number) {
    return `This action removes a #${id} event`;
  }
}
