import { Tracker } from '../src/app/features/trackers/tracker.types';
import { TrackerEvent } from '../src/app/features/trackers/events.types';

export function makeCounterTracker(overrides: Partial<Tracker<'counter'>> = {}): Tracker {
  return {
    id: '1',
    name: 'Steps',
    type: 'counter',
    summary: { sum: 0 },
    ...overrides,
  };
}

export function makeCategoryTracker(overrides: Partial<Tracker<'category'>> = {}): Tracker {
  return {
    id: '1',
    name: 'Steps',
    type: 'category',
    summary: [{ category: 'test', amount: 0 }],
    ...overrides,
  };
}

export function makeEvent(overrides: Partial<TrackerEvent> = {}): TrackerEvent {
  return {
    id: 'e1',
    timestamp: new Date('2024-06-10T10:00:00Z'),
    data: {
      delta: 10,
    },
    ...overrides,
  };
}

export function testIdSelector(testId: string) {
  return '[data-testid="' + testId + '"]';
}
