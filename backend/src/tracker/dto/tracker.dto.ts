import { TrackerSummary, TrackerType } from '../schemas/tracker.schema.js';

export class TrackerDto {
  id: string;
  name: string;
  type: TrackerType;
  summary: TrackerSummary;
}
