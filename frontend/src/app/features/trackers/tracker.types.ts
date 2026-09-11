type SummaryFor<T extends TrackerType> = T extends typeof TRACKER_TYPES.counter
  ? CounterTrackerSummary
  : T extends typeof TRACKER_TYPES.category
    ? CategoryTrackerSummary
    : never;

export type Tracker<T extends TrackerType = TrackerType> = {
  [K in TrackerType]: {
    id: string;
    name: string;
    type: K;
    summary: SummaryFor<K>;
  };
}[T];

// export type Tracker<T extends TrackerType = TrackerType> = {
//   id: string;
//   name: string;
//   type: T;
//   summary: SummaryFor<T>;
// };
// export interface Tracker {
//   id: string;
//   name: string;
//   type: TrackerType;
//   summary: TrackerSummary;
// }

export type CreateTracker<T extends TrackerType = TrackerType> = Omit<Tracker<T>, 'id' | 'summary'>;

export const TRACKER_TYPES = {
  counter: 'counter',
  category: 'category',
} as const;

export const DEFAULT_TRACKER: CreateTracker<'counter'> = {
  name: '',
  type: 'counter',
};

export type TrackerType = (typeof TRACKER_TYPES)[keyof typeof TRACKER_TYPES];

export type TrackerSummary = CounterTrackerSummary | CategoryTrackerSummary;

export interface CounterTrackerSummary {
  sum: number;
}

export type CategoryTrackerSummary = CategoryTrackerSummaryEntry[];
export type CategoryTrackerSummaryEntry = { category: string; amount: number };
