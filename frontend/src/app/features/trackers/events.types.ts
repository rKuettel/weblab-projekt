export interface TrackerEvent {
  id: string;
  timestamp: Date;
  type: string;
  data: TrackerEventData;
}

export type CreateTrackerEvent = Omit<TrackerEvent, 'id'>;

export type TrackerEventData = CouterEvent;

export interface CouterEvent {
  delta: number;
}
