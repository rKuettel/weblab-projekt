import { TrackerDocument } from '../schemas/tracker.schema.js';
import { TrackerDto } from './tracker.dto.js';

export function toTrackerDto(tracker: TrackerDocument): TrackerDto {
  return {
    id: tracker.id,
    name: tracker.name,
    type: tracker.type,
    summary: tracker.summary ?? 0,
  };
}
