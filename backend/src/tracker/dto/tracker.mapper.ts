import { TrackerDocument } from '../schemas/tracker.schema.js';
import { TrackerDto } from './tracker.dto.js';

export function toDto(tracker: TrackerDocument): TrackerDto {
  return {
    id: tracker.id,
    name: tracker.name,
    type: tracker.type,
  };
}
