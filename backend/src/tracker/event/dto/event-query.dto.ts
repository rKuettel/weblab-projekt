import { IsDateString, IsOptional } from 'class-validator';

export class EventQueryDto {
  @IsOptional()
  @IsDateString()
  from?: Date;
  @IsOptional()
  @IsDateString()
  to?: Date;
}
