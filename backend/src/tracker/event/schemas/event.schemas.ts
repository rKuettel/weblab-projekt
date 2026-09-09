import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrackerEventDocument = HydratedDocument<TrackerEvent>;

@Schema()
export class TrackerEvent {
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
  type: TrackerEventType;

  @Prop({
    type: Types.Map,
    required: true,
  })
  data: EventData;
}

export type EventData = CounterEvent | CategoryEvent;

export class CounterEvent {
  delta: number;
}

export class CategoryEvent {
  category: string;
}

export const TrackerEventSchema = SchemaFactory.createForClass(TrackerEvent);

export type TrackerEventType = 'counter';
