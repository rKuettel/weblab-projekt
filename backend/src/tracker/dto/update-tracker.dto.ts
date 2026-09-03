import { PartialType } from '@nestjs/mapped-types';
import { CreateTrackerDto } from './create-tracker.dto.js';

export class UpdateTrackerDto extends PartialType(CreateTrackerDto) {}
