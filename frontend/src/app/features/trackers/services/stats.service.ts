import { Service } from '@angular/core';
import { TrackerEvent } from '../events.types';

@Service()
export class StatsService {
  groupByDate<T extends TrackerEvent>(events: T[]): Record<string, T[]> {
    return this.groupBy(events, (e) => e.timestamp.toISOString().split('T')[0]);
  }

  groupBy<T, K extends string | number | symbol>(
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

  sumBy<T>(items: T[], selector: (item: T) => number): number {
    return items.reduce((sum, item) => sum + selector(item), 0);
  }
}
