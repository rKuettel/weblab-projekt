import { Component, inject } from '@angular/core';
import { CreateTracker } from '../../tracker.types';
import { TrackerCardComponent } from '../../dumb/tracker-card/tracker-card.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';

@Component({
  imports: [TrackerCardComponent, TrackerFormComponent],
  selector: 'app-tracker-dashboard',
  styles: `
    .dashboard {
      display: grid;
      grid-template-columns: 1fr;
    }

    @media screen and (min-width: 768px) {
      .dashboard {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media only screen and (min-width: 1024px) {
      .dashboard {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
  template: `
    <div class="grid dashboard">
      @for (tracker of this.trackers.value(); track $index) {
        <app-tracker-card [tracker]="tracker"></app-tracker-card>
      }
      <article>
        <header><h3>Add New Tracker</h3></header>
        <app-tracker-form (onFormSubmit)="addTracker($event)"></app-tracker-form>
      </article>
    </div>
  `,
})
export class TrackerDashboardComponent {
  private api = inject(TrackerApi);
  public trackers = this.api.getTrackers();

  addTracker(tracker: CreateTracker) {
    console.log('Creating new Tracker: ', tracker);
    this.api
      .createTracker(tracker)
      .subscribe((t) => this.trackers.update((trackers) => [...trackers, t]));
  }
}
