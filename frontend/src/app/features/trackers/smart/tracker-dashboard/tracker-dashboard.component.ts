import { Component, inject, signal } from '@angular/core';
import { CreateTracker, Tracker } from '../../tracker.types';
import { TrackerCardComponent } from '../../dumb/tracker-card/tracker-card.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { EventFormComponent } from '../../dumb/event-form/event-form.component';
import { EventApi } from '../../services/api/event.api';
import { CreateTrackerEvent } from '../../events.types';

@Component({
  imports: [TrackerCardComponent, TrackerFormComponent, EventFormComponent],
  selector: 'app-tracker-dashboard',
  styles: `
    .dashboard {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
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
    <div class="dashboard">
      @for (tracker of this.trackers.value(); track tracker.id) {
        <app-tracker-card
          [tracker]="tracker"
          (onAddEventClick)="changeCurrentTracker(tracker)"
        ></app-tracker-card>
      }
      <article>
        <header><h3>Add New Tracker</h3></header>
        <app-tracker-form (onFormSubmit)="addTracker($event)"></app-tracker-form>
      </article>

      @if (this.currentTracker()) {
        <article>
          <header>
            <h3>Add Event for '{{ this.currentTracker()!.name }}'</h3>
          </header>
          <app-event-form (onFormSubmit)="addEvent($event)"></app-event-form>
        </article>
      }
    </div>
  `,
})
export class TrackerDashboardComponent {
  private api = inject(TrackerApi);
  private eventApi = inject(EventApi);
  public trackers = this.api.getTrackers();
  public currentTracker = signal<Tracker | undefined>(undefined);

  addTracker(tracker: CreateTracker) {
    console.log('Creating new Tracker: ', tracker);
    this.api
      .createTracker(tracker)
      .subscribe((t) => this.trackers.update((trackers) => [...trackers, t]));
  }

  addEvent(event: CreateTrackerEvent) {
    console.log('Creating new event: ', event);
    const tracker = this.currentTracker();
    if (tracker) {
      this.eventApi
        .addEvent(tracker.id, event)
        .subscribe((updated) =>
          this.trackers.update((trackers) =>
            trackers.map((t) => (t.id === updated.id ? updated : t)),
          ),
        );
    }
  }

  changeCurrentTracker(event: Tracker) {
    this.currentTracker.set(event);
  }
}
