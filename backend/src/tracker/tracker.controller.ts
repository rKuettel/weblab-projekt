import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TrackerService } from './tracker.service.js';
import { CreateTrackerDto } from './dto/create-tracker.dto.js';
import { UpdateTrackerDto } from './dto/update-tracker.dto.js';
import { TrackerDto } from './dto/tracker.dto.js';
import { toTrackerDto } from './dto/tracker.mapper.js';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  async create(@Body() createTrackerDto: CreateTrackerDto) {
    const tracker = await this.trackerService.create(createTrackerDto);
    return toTrackerDto(tracker);
  }

  @Get()
  async findAll(): Promise<TrackerDto[]> {
    const trackers = await this.trackerService.findAll();

    return trackers.map(toTrackerDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tracker = await this.trackerService.findOne(id);
    if (!tracker) {
      throw new NotFoundException();
    }
    return toTrackerDto(tracker);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackerDto: UpdateTrackerDto,
  ) {
    const tracker = await this.trackerService.update(id, updateTrackerDto);
    if (!tracker) {
      throw new NotFoundException();
    }
    return toTrackerDto(tracker);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackerService.remove(id);
  }
}
