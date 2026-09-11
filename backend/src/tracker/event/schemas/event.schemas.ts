import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type TrackerEventDocument = HydratedDocument<TrackerEvent>;

@Schema()
export class TrackerEvent {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  })
  trackerId: Types.ObjectId;

  @Prop({
    required: true,
  })
  timestamp: Date;

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
  amount: number;
}

export const TrackerEventSchema = SchemaFactory.createForClass(TrackerEvent);
