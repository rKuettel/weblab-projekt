import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { TrackerDto } from '../dto/tracker.dto.js';
import { toTrackerDto } from '../dto/tracker.mapper.js';
import { EventQueryDto } from './dto/event-query.dto.js';
import { toEventDto } from './dto/event.mapper.js';
import { TrackerService } from '../tracker.service.js';
import { validate } from 'class-validator';
import { CategoryEventDto, CounterEventDto } from './dto/event.dto.js';
import { plainToInstance } from 'class-transformer';
import { EventData } from './schemas/event.schemas.js';
import { TrackerDocument } from '../schemas/tracker.schema.js';

@Controller('tracker/:trackerId/event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly trackerService: TrackerService,
  ) {}

  @Post()
  async create(
    @Param('trackerId') trackerId: string,
    @Body() createEventDto: CreateEventDto,
  ): Promise<TrackerDto | undefined> {
    const tracker = await this.trackerService.findOne(trackerId);
    if (!tracker) {
      throw new NotFoundException();
    }
    await this.validateEventData(tracker, createEventDto.data);

    const updatedTracker = await this.eventService.create(
      tracker,
      createEventDto,
    );
    if (updatedTracker) {
      return toTrackerDto(tracker);
    }
    return undefined;
  }

  private async validateEventData(tracker: TrackerDocument, data: EventData) {
    const dto =
      tracker.type === 'counter'
        ? plainToInstance(CounterEventDto, data)
        : plainToInstance(CategoryEventDto, data);

    const errors = await validate(dto);
    if (errors.length > 0) {
      const messages = errors.flatMap((error) =>
        Object.values(error.constraints ?? {}),
      );
      throw new BadRequestException(
        `Event data is not valid for a ${tracker.type} tracker: ${messages.join(', ')}`,
      );
    }
  }

  @Get()
  async findInRange(
    @Param('trackerId') trackerId: string,
    @Query() query: EventQueryDto,
  ) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    const events = await this.eventService.findInRange(trackerId, from, to);
    return events.map(toEventDto);
  }

  @Delete(':id')
  remove(@Param('trackerId') trackerId: string, @Param('id') id: string) {
    return this.eventService.remove(trackerId, id);
  }
}
