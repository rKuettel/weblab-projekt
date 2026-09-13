import { TrackerEvent, TrackerEventData } from '../../events.types';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';

export function groupByDate<T extends TrackerEvent>(events: T[]): Record<string, T[]> {
  return groupBy(events, (e) => e.timestamp.toISOString().split('T')[0]);
}

export function groupBy<T, K extends string | number | symbol>(
  items: T[],
  keyFn: (item: T) => K,
  inital: Record<K, T[]> = {} as Record<K, T[]>,
): Record<K, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, inital);
}

export function sumBy<T>(items: T[], selector: (item: T) => number): number {
  return items.reduce((sum, item) => sum + selector(item), 0);
}

export function generateEventPerDay<D extends TrackerEventData>(
  range: DateRange,
  defaultData: D,
): TrackerEvent<D>[] {
  return datesInbetween(range).map((d) => {
    return {
      id: '',
      timestamp: d,
      data: {
        ...defaultData,
      },
    };
  });
}

export function datesInbetween(range: DateRange): Date[] {
  const dates: Date[] = [];
  const start = range.from;
  const end = range.to;

  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (current > endMidnight) return dates;

  while (current <= endMidnight) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
