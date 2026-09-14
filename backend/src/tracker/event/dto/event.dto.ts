import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';

export class EventDto {
  @IsString()
  id: string;
  @IsDateString()
  timestamp: Date;
  @IsObject()
  data: EventDataDto;
}

export type EventDataDto = CounterEventDto | CategoryEventDto;

export class CounterEventDto {
  @IsNumber()
  delta: number;
}

export class CategoryEventDto {
  @IsString()
  category: string;
  @IsNumber()
  amount: number;
}
