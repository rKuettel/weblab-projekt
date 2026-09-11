import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type TrackerDocument = HydratedDocument<Tracker>;

@Schema()
export class Tracker {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: true,
    type: String,
  })
  type: TrackerType;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.Mixed,
  })
  summary: TrackerSummary;
}

export type TrackerType = 'counter' | 'category';
export type TrackerSummary = CounterTrackerSummary | CategoryTrackerSummary;

export class CounterTrackerSummary {
  sum: number;
}

export type CategoryTrackerSummary = CategoryTrackerSummaryEntry[];
export type CategoryTrackerSummaryEntry = { category: string; amount: number };

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
