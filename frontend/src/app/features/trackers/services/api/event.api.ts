import { inject, Service, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateTrackerEvent, TrackerEvent, TrackerEventData } from '../../events.types';
import { Observable } from 'rxjs';
import { Tracker } from '../../tracker.types';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';

@Service()
export class EventApi {
  private apiUrl = (trackerId: string) => `${environment.apiUrl}/tracker/${trackerId}/event`;
  private http = inject(HttpClient);

  public getTrackerEvents(trackerId: Signal<string>, dateRange: Signal<DateRange>) {
    return httpResource<TrackerEvent[]>(
      () => ({
        url: this.apiUrl(trackerId()),
        params: {
          from: dateRange().from,
          to: dateRange().to,
        },
      }),
      {
        defaultValue: [],
      },
    );
  }

  public addEvent(trackerId: string, event: CreateTrackerEvent): Observable<Tracker> {
    return this.http.post<Tracker>(this.apiUrl(trackerId), event);
  }
}
