import { OmitType } from '@nestjs/mapped-types';
import { EventDto } from './event.dto.js';

export class CreateEventDto extends OmitType(EventDto, ['id']) {}
