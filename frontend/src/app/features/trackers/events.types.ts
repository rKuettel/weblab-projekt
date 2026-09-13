export interface BaseTrackerEvent<D extends TrackerEventData> {
  id: string;
  timestamp: Date;
  data: D;
}

// export type TrackerEvent = BaseTrackerEvent<TrackerEventData>;
export interface TrackerEvent<D extends TrackerEventData = TrackerEventData> {
  id: string;
  timestamp: Date;
  data: D;
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

// export type CounterTrackerEvent = BaseTrackerEvent<CounterEventData>;
export type CounterTrackerEvent = TrackerEvent<CounterEventData>;
// export type CategoryTrackerEvent = BaseTrackerEvent<CategoryEventData>;
export type CategoryTrackerEvent = TrackerEvent<CategoryEventData>;
