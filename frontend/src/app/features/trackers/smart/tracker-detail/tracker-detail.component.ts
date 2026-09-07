import { Component, computed, inject, Signal, signal } from '@angular/core';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi } from '../../services/api/event.api';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import { TrackerSummaryComponent } from '../../dumb/tracker-summary/tracker-summary.component';
import { InputComponent } from '../../../../components/input/input.component';
import {
  DateRange,
  DateRangeSelectorComponent,
  daysAgo,
  toDateString,
} from '../../../../components/date-range-selector/date-range-selector.component';

@Component({
  imports: [EventListComponent, DateRangeSelectorComponent, TrackerSummaryComponent],
  selector: 'app-tracker-detail',
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header h2 {
      margin-bottom: 0;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media screen and (min-width: 768px) {
      .content {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media only screen and (min-width: 1024px) {
      .content {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
  template: `
    <div class="header">
      <h2>Trackers</h2>
      <app-date-range-selector [(dateRange)]="this.dateRange"></app-date-range-selector>
    </div>
    <div class="content">
      @if (this.trackerEvents.hasValue()) {
        <article [aria-busy]="this.trackerEvents.isLoading()">
          <h3>Events</h3>

          <app-event-list [events]="trackerEvents.value()"></app-event-list>
        </article>
      }
      <article [aria-busy]="this.tracker.isLoading()">
        @if (this.tracker.hasValue()) {
          <app-tracker-summary [summary]="this.tracker.value().summary"></app-tracker-summary>
        }
      </article>
    </div>
  `,
})
export class TrackerDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  readonly trackerId = signal(this.activatedRoute.snapshot.params['id']);

  public dateRange = signal<DateRange>({
    from: toDateString(daysAgo(7)),
    to: toDateString(new Date()),
  });
  private api = inject(TrackerApi);
  private eventApi = inject(EventApi);
  public tracker = this.api.getTracker(this.trackerId);
  public trackerEvents = this.eventApi.getTrackerEvents(this.trackerId, this.dateRange);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.trackerId.set(params['id']);
    });
  }
}
