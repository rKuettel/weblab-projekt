import { inject, Service, Signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateTracker, Tracker } from '../../tracker.types';
import { Observable } from 'rxjs';

@Service()
export class TrackerApi {
  private apiUrl = `${environment.apiUrl}/tracker`;
  private apiUrlWithId = (id: string) => `${environment.apiUrl}/tracker/${id}`;
  private http = inject(HttpClient);

  public getTracker(id: Signal<string>) {
    return httpResource<Tracker>(() => this.apiUrlWithId(id()));
  }

  public getTrackers() {
    return httpResource<Tracker[]>(() => this.apiUrl, { defaultValue: [] });
  }

  public createTracker(newTracker: CreateTracker): Observable<Tracker> {
    return this.http.post<Tracker>(this.apiUrl, newTracker);
  }

  public editTracker(id: string, updateTracker: Partial<CreateTracker>): Observable<Tracker> {
    return this.http.patch<Tracker>(this.apiUrlWithId(id), updateTracker);
  }

  public deleteTracker(id: string): Observable<{}> {
    return this.http.delete(this.apiUrlWithId(id));
  }
}
