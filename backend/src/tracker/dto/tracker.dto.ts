import { TRACKER_TYPES } from '../schemas/tracker.schema.js';
import type { TrackerType, TrackerSummary } from '../schemas/tracker.schema.js';
import { IsIn, IsString } from 'class-validator';

export class TrackerDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsIn(Object.values(TRACKER_TYPES))
  type: TrackerType;
  summary: TrackerSummary;
}
