import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { TrackerDto } from '../dto/tracker.dto.js';
import { toTrackerDto } from '../dto/tracker.mapper.js';
import { EventQueryDto } from './dto/event-query.dto.js';
import { toEventDto } from './dto/event.mapper.js';

@Controller('tracker/:trackerId/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Param('trackerId') trackerId: string,
    @Body() createEventDto: CreateEventDto,
  ): Promise<TrackerDto | undefined> {
    const tracker = await this.eventService.create(trackerId, createEventDto);
    if (tracker) {
      return toTrackerDto(tracker);
    }
    return undefined;
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
