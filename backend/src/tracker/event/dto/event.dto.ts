export class EventDto {
  id: string;
  timestamp: Date;
  type: string;
  data: EventDataDto;
}

export type EventDataDto = CouterEventDto;

export interface CouterEventDto {
  delta: number;
}
