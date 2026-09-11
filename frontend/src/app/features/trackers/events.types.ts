export interface TrackerEvent {
  id: string;
  timestamp: Date;
  data: TrackerEventData;
}

export type CreateTrackerEvent = Omit<TrackerEvent, 'id'>;

export type TrackerEventData = CounterEventData | CategoryEventData;

export interface CounterEventData {
  delta: number;
}

export interface CategoryEventData {
  category: string;
  amount: number;
}

type EventOf<T, Data extends TrackerEventData> = Omit<T, 'data'> & { data: Data };

export type CounterTrackerEvent = EventOf<TrackerEvent, CounterEventData>;
export type CategoryTrackerEvent = EventOf<TrackerEvent, CategoryEventData>;
