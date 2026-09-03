import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { Tracker } from '../../tracker.types';
import { Observable } from 'rxjs';

@Service()
export class TrackerApi {
  private apiUrl = `${environment.apiUrl}/tracker`;
  private http = inject(HttpClient);

  public getTrackers() {
    return httpResource<Tracker[]>(() => this.apiUrl, { defaultValue: [] });
  }

  public createTracker(newTracker: Tracker): Observable<Tracker> {
    return this.http.post<Tracker>(this.apiUrl, newTracker);
  }
}
