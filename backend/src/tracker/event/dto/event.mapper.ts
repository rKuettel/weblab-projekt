import { TrackerEventDocument } from '../schemas/event.schemas.js';
import { EventDto } from './event.dto.js';

export function toEventDto(event: TrackerEventDocument): EventDto {
  return {
    id: event.id,
    timestamp: event.timestamp,
    data: event.data,
  };
}
