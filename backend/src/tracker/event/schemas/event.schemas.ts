import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({
    type: Types.ObjectId,
    ref: 'Tracker',
    required: true,
    index: true,
  })
  trackerId: Types.ObjectId;

  @Prop({
    required: true,
  })
  timestamp: Date;

  @Prop({ required: true })
  type: EventType;

  @Prop({
    type: Types.Map,
    required: true,
  })
  data: CounterEvent | CategoryEvent;
}

@Schema()
export class CounterEvent {
  delta: number;
}

@Schema()
export class CategoryEvent {
  category: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type EventType = 'counter';
