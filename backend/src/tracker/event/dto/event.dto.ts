import { EventData } from '../schemas/event.schemas.js';

export class EventDto {
  id: string;
  timestamp: Date;
  data: EventData;
}
