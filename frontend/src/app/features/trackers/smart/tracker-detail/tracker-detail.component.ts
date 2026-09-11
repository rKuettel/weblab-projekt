import { Component, computed, inject, signal } from '@angular/core';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi } from '../../services/api/event.api';
import { ActivatedRoute, Router } from '@angular/router';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import {
  DateRange,
  DateRangeSelectorComponent,
  daysAgo,
} from '../../../../components/date-range-selector/date-range-selector.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { CreateTracker } from '../../tracker.types';
import { CategoryTrackerEvent, CounterTrackerEvent } from '../../events.types';
import { CounterTrackerStatsComponent } from '../../dumb/counter-tracker-stats/counter-tracker-stats.component';
import { CategoryTrackerStatsComponent } from '../../dumb/category-tracker-stats/category-tracker-stats.component';

@Component({
  imports: [
    EventListComponent,
    DateRangeSelectorComponent,
    ButtonComponent,
    ConfirmDialogComponent,
    TranslatePipe,
    DialogComponent,
    TrackerFormComponent,
    CounterTrackerStatsComponent,
    CategoryTrackerStatsComponent,
  ],
  selector: 'app-tracker-detail',
  styles: `
    .header {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
    }
    .toolbar {
      display: flex;
      width: 100%;
      align-items: center;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .header h2 {
      margin-bottom: 0;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 3fr;
      gap: 1rem;
    }

    .events {
      min-width: 20rem;
    }

    .stats {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr 1fr;
      align-items: start;
      align-content: start;
    }

    /* @media screen and (min-width: 768px) { */
    /*   .content { */
    /*     grid-template-columns: repeat(2, 1fr); */
    /*   } */
    /* } */
    /* @media only screen and (min-width: 1024px) { */
    /*   .content { */
    /*     grid-template-columns: repeat(3, 1fr); */
    /*   } */
    /* } */
  `,
  template: `
    <div class="header">
      <h2>Tracker: {{ this.tracker.value()?.name || '' }}</h2>

      <div class="actions">
        <app-button
          [text]="'tracker.edit' | translate"
          (clicked)="editDialogOpen.set(true)"
        ></app-button>
        <app-button
          variant="secondary"
          [text]="'tracker.delete' | translate"
          (clicked)="deleteDialogOpen.set(true)"
        ></app-button>
      </div>
    </div>
    <div class="toolbar">
      <app-date-range-selector
        (changed)="dateRangeChanged.set($event)"
        [dateRange]="this.dateRange()"
      >
      </app-date-range-selector>
    </div>
    <div class="content">
      @if (this.trackerEvents.hasValue()) {
        <article class="events" [aria-busy]="this.trackerEvents.isLoading()">
          <h3>Events</h3>

          <app-event-list
            [events]="trackerEvents.value()"
            (onDelete)="this.deleteEvent($event)"
          ></app-event-list>
        </article>
      }

      @if (this.trackerEvents.hasValue() && this.tracker.hasValue()) {
        @let tracker = this.tracker.value();
        @switch (tracker.type) {
          @case ('counter') {
            <app-counter-tracker-stats
              [trackerEvents]="this.counterTrackerEvents()"
              [tracker]="tracker"
              [dateRange]="this.dateRangeChanged()"
            ></app-counter-tracker-stats>
          }
          @case ('category') {
            <app-category-tracker-stats
              [trackerEvents]="this.categoryTrackerEvents()"
              [trackerSummary]="tracker.summary"
              [dateRange]="this.dateRangeChanged()"
            ></app-category-tracker-stats>
          }
        }
      }
    </div>
    <app-confirm-dialog
      [title]="'tracker.confirmDelete' | translate"
      [text]="'tracker.confirmDeleteLong' | translate"
      [open]="deleteDialogOpen()"
      (onClose)="deleteDialogOpen.set(false)"
      (confirmed)="deleteTracker()"
    ></app-confirm-dialog>

    <app-dialog
      [title]="'tracker.Edit' | translate"
      [open]="editDialogOpen()"
      (onClose)="editDialogOpen.set(false)"
    >
      <app-tracker-form
        [tracker]="this.tracker.value()"
        [typeDisabled]="true"
        (onFormSubmit)="updateTracker($event)"
      ></app-tracker-form>
    </app-dialog>
  `,
})
export class TrackerDetailComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly trackerId = signal(this.activatedRoute.snapshot.params['id']);
  readonly deleteDialogOpen = signal(false);
  readonly editDialogOpen = signal(false);

  public dateRange = signal<DateRange>({
    from: daysAgo(7),
    to: new Date(),
  });

  public dateRangeChanged = signal<DateRange>({
    ...this.dateRange(),
  });

  private dateRangeTransformed = computed(() => {
    const date = this.dateRangeChanged();
    const to = date.to;
    const from = date.from;
    if (to) {
      to.setHours(23, 59, 59);
    }
    if (from) {
      from.setHours(0, 0, 0);
    }
    return {
      from: from,
      to: to,
    };
  });

  private trackerApi = inject(TrackerApi);
  private eventApi = inject(EventApi);
  public tracker = this.trackerApi.getTracker(this.trackerId);
  public trackerEvents = this.eventApi.getTrackerEvents(this.trackerId, this.dateRangeTransformed);

  public counterTrackerEvents = computed(() => {
    return this.trackerEvents.value() as CounterTrackerEvent[];
  });
  public categoryTrackerEvents = computed(() => {
    return this.trackerEvents.value() as CategoryTrackerEvent[];
  });

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.trackerId.set(params['id']);
    });
  }

  deleteEvent(eventId: string) {
    this.eventApi.deleteEvent(this.trackerId(), eventId).subscribe(() => {
      this.trackerEvents.reload();
      this.tracker.reload();
    });
  }

  deleteTracker() {
    this.trackerApi.deleteTracker(this.trackerId()).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  updateTracker(updatedTracker: CreateTracker) {
    const updatedTrackerName = {
      name: updatedTracker.name,
    };

    this.trackerApi.editTracker(this.trackerId(), updatedTrackerName).subscribe((tracker) => {
      this.tracker.set(tracker);
      this.editDialogOpen.set(false);
    });
  }
}
