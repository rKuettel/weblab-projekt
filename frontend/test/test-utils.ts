import { Tracker } from '../src/app/features/trackers/tracker.types';
import { TrackerEvent } from '../src/app/features/trackers/events.types';

export function makeTracker(overrides: Partial<Tracker> = {}): Tracker {
  return {
    id: '1',
    name: 'Steps',
    type: 'counter',
    summary: 0,
    ...overrides,
  };
}

export function makeEvent(overrides: Partial<TrackerEvent> = {}): TrackerEvent {
  return {
    id: 'e1',
    timestamp: new Date('2024-06-10T10:00:00Z'),
    type: 'counter',
    data: {
      delta: 10,
    },
    ...overrides,
  };
}

export function testIdSelector(testId: string) {
  return '[data-testid="' + testId + '"]';
}
