import { IsDateString } from 'class-validator';

export class EventQueryDto {
  @IsDateString()
  from?: Date;
  @IsDateString()
  to?: Date;
}
