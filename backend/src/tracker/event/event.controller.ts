import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { TrackerDto } from '../dto/tracker.dto.js';
import { toDto } from '../dto/tracker.mapper.js';
import { EventQueryDto } from './dto/event-query.dto.js';

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
      return toDto(tracker);
    }
    return undefined;
  }

  @Get()
  findInRange(
    @Param('trackerId') trackerId: string,
    @Query() query: EventQueryDto,
  ) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;

    return this.eventService.findInRange(trackerId, from, to);
  }

  // @Get()
  // findAll(@Param('trackerId') trackerId: string) {
  //   return this.eventService.findAll(trackerId);
  // }

  @Patch(':id')
  update(
    @Param('trackerId') trackerId: string,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(trackerId, +id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('trackerId') trackerId: string, @Param('id') id: string) {
    return this.eventService.remove(trackerId, +id);
  }
}
