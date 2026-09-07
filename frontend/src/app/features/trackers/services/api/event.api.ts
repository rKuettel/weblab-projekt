import { inject, Service, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateTrackerEvent, TrackerEvent, TrackerEventData } from '../../events.types';
import { Observable } from 'rxjs';
import { Tracker } from '../../tracker.types';

@Service()
export class EventApi {
  private apiUrl = (trackerId: string) => `${environment.apiUrl}/tracker/${trackerId}/event`;
  private http = inject(HttpClient);

  public getTrackerEvents(trackerId: Signal<string>, queryParams: Signal<EventsQueryParams>) {
    return httpResource<TrackerEvent[]>(
      () => {
        const q = queryParams();
        const params: Record<string, string> = {};
        if (q.from) params['from'] = q.from.toISOString();
        if (q.to) params['to'] = q.to.toISOString();

        return {
          url: this.apiUrl(trackerId()),
          params,
        };
      },
      {
        parse: (response) => {
          const events = response as TrackerEvent[];
          return events.map((e) => {
            return {
              ...e,
              timestamp: new Date(e.timestamp),
            };
          });
        },
        defaultValue: [],
      },
    );
  }

  public addEvent(trackerId: string, event: CreateTrackerEvent): Observable<Tracker> {
    return this.http.post<Tracker>(this.apiUrl(trackerId), event);
  }
}

export interface EventsQueryParams {
  from?: Date;
  to?: Date;
}
