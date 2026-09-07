import { IsDateString } from 'class-validator';

export class EventQueryDto {
  @IsDateString()
  from?: string;
  @IsDateString()
  to?: string;
}
