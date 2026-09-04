export interface Tracker {
  id: string;
  name: string;
  type: TrackerType;
}

export type CreateTracker = Omit<Tracker, 'id' | 'summary'>;

export const DEFAULT_TRACKER: CreateTracker = {
  name: '',
  type: 'counter',
};

export const TRACKER_TYPES = {
  counter: 'counter',
} as const;

export type TrackerType = (typeof TRACKER_TYPES)[keyof typeof TRACKER_TYPES];

export type TrackerSummary = CounterTrackerSummary;

export interface CounterTrackerSummary {
  totalCount: number;
}
