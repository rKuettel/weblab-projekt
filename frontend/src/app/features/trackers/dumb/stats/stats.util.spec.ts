import { datesInbetween, generateEventPerDay, groupBy, groupByDate, sumBy } from './stats.util';
import { makeEvent } from '../../../../../../test/test-utils';

describe('groupBy', () => {
  it('groups items by the value returned from the key function', () => {
    const result = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'));
    expect(result).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  it('returns an empty object for an empty array', () => {
    expect(groupBy([], (x: number) => x)).toEqual({});
  });

  it('uses the provided initial value and merges groups into it', () => {
    const result = groupBy([1, 2], (n): string => (n === 1 ? 'one' : 'existing'), {
      existing: [99],
    });
    expect(result).toEqual({
      existing: [99, 2],
      one: [1],
    });
  });
});

describe('groupByDate', () => {
  it('groups events by the UTC date of their timestamp', () => {
    const events = [
      makeEvent({ id: '1', timestamp: new Date('2026-06-10T10:00:00Z') }),
      makeEvent({ id: '2', timestamp: new Date('2026-06-10T23:00:00Z') }),
      makeEvent({ id: '3', timestamp: new Date('2026-06-11T01:00:00Z') }),
    ];
    expect(groupByDate(events)).toEqual({
      '2026-06-10': [events[0], events[1]],
      '2026-06-11': [events[2]],
    });
  });

  it('returns an empty object when there are no events', () => {
    expect(groupByDate([])).toEqual({});
  });
});

describe('sumBy', () => {
  it('sums the selected number of each item', () => {
    const events = [{ delta: 1 }, { delta: 2 }, { delta: 3 }];
    expect(sumBy(events, (e) => e.delta)).toBe(6);
  });

  it('returns 0 for an empty array', () => {
    expect(sumBy([], (x: number) => x)).toBe(0);
  });
});

describe('datesInbetween', () => {
  it('includes both the start and end date', () => {
    const dates = datesInbetween({ from: new Date(2026, 9, 10), to: new Date(2026, 9, 12) });
    expect(dates).toEqual([new Date(2026, 9, 10), new Date(2026, 9, 11), new Date(2026, 9, 12)]);
  });

  it('returns a single date when start and end are the same day', () => {
    const dates = datesInbetween({ from: new Date(2026, 9, 10), to: new Date(2026, 9, 10) });
    expect(dates).toEqual([new Date(2026, 9, 10)]);
  });

  it('spans month and year boundaries', () => {
    const dates = datesInbetween({ from: new Date(2025, 11, 30), to: new Date(2026, 0, 2) });
    expect(dates).toEqual([
      new Date(2025, 11, 30),
      new Date(2025, 11, 31),
      new Date(2026, 0, 1),
      new Date(2026, 0, 2),
    ]);
  });

  it('ignores the time of day of the given dates', () => {
    const dates = datesInbetween({
      from: new Date(2026, 9, 10, 9, 30),
      to: new Date(2026, 9, 11, 18, 45),
    });
    expect(dates).toEqual([new Date(2026, 9, 10), new Date(2026, 9, 11)]);
  });

  it('returns an empty array when the start date is after the end date', () => {
    const dates = datesInbetween({ from: new Date(2026, 9, 12), to: new Date(2026, 5, 10) });
    expect(dates).toEqual([]);
  });
});

describe('generateEventPerDay', () => {
  it('creates one event per day in the range with the default data', () => {
    const events = generateEventPerDay(
      { from: new Date(2026, 9, 10), to: new Date(2026, 9, 12) },
      { delta: 0 },
    );
    expect(events.map((e) => e.timestamp)).toEqual([
      new Date(2026, 9, 10),
      new Date(2026, 9, 11),
      new Date(2026, 9, 12),
    ]);
    expect(events.every((e) => e.id === '' && e.data.delta === 0)).toBe(true);
  });

  it('does not share the data object between events or with the default', () => {
    const defaultData = { delta: 0 };
    const events = generateEventPerDay(
      { from: new Date(2026, 9, 10), to: new Date(2026, 9, 11) },
      defaultData,
    );
    events[0].data.delta = 5;
    expect(defaultData.delta).toBe(0);
    expect(events[1].data.delta).toBe(0);
  });

  it('returns no events when the range is invalid', () => {
    const events = generateEventPerDay(
      { from: new Date(2026, 5, 12), to: new Date(2026, 5, 10) },
      { delta: 0 },
    );
    expect(events).toEqual([]);
  });
});
