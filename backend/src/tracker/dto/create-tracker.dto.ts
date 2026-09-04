import { OmitType } from '@nestjs/mapped-types';
import { TrackerDto } from './tracker.dto.js';

export class CreateTrackerDto extends OmitType(TrackerDto, ['id']) {}
