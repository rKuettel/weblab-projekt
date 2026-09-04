import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrackerService } from './tracker.service.js';
import { CreateTrackerDto } from './dto/create-tracker.dto.js';
import { UpdateTrackerDto } from './dto/update-tracker.dto.js';
import { TrackerDto } from './dto/tracker.dto.js';
import { toDto } from './dto/tracker.mapper.js';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackerService.create(createTrackerDto);
  }

  @Get()
  async findAll(): Promise<TrackerDto[]> {
    const trackers = await this.trackerService.findAll();

    return trackers.map(toDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackerDto: UpdateTrackerDto) {
    return this.trackerService.update(+id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackerService.remove(+id);
  }
}
