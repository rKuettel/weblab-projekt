import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrackerDocument = HydratedDocument<Tracker>;

@Schema()
export class Tracker {
  @Prop()
  name: string;
  @Prop()
  type: string;
  @Prop()
  summary: number;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
