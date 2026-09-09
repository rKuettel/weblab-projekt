import {
  CounterEvent,
  TrackerEventDocument,
} from '../schemas/event.schemas.js';
import { CouterEventDto, EventDto } from './event.dto.js';

export function toEventDto(event: TrackerEventDocument): EventDto {
  let data;

  switch (event.type) {
    case 'counter':
      data = mapCounterData(event.data as CounterEvent);
      break;
    default:
      throw new Error("Can't map unkown Event Type");
  }

  return {
    id: event.id,
    type: event.type,
    timestamp: event.timestamp,
    data: data,
  };
}

function mapCounterData(counterData: CounterEvent): CouterEventDto {
  return {
    delta: counterData.delta,
  };
}
