import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateTrackerEvent, TrackerEvent, TrackerEventData } from '../../events.types';
import { Observable } from 'rxjs';
import { Tracker } from '../../tracker.types';

@Service()
export class EventApi {
  private apiUrl = (trackerId: string) => `${environment.apiUrl}/tracker/${trackerId}/event`;
  private http = inject(HttpClient);

  public getTrackerEvents(trackerId: string) {
    return httpResource<TrackerEventData[]>(() => this.apiUrl(trackerId), {
      defaultValue: [],
    });
  }

  public addEvent(trackerId: string, event: CreateTrackerEvent): Observable<Tracker> {
    return this.http.post<Tracker>(this.apiUrl(trackerId), event);
  }
}
