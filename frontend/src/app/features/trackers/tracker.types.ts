export interface Tracker {
  name: string;
  type: TrackerType;
  summary: TrackerSummary;
}

export const DEFAULT_TRACKER: Tracker = {
  name: 'Jaha',
  type: 'counter',
  summary: {
    totalCount: 0,
  },
};

export const TRACKER_TYPES = {
  counter: 'counter',
} as const;

export type TrackerType = (typeof TRACKER_TYPES)[keyof typeof TRACKER_TYPES];

export type TrackerSummary = CounterTrackerSummary;

export interface CounterTrackerSummary {
  totalCount: number;
}
