import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
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
import { translate, TranslatePipe } from '@ngx-translate/core';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { CreateTracker } from '../../tracker.types';
import { CategoryTrackerEvent, CounterTrackerEvent, CreateTrackerEvent } from '../../events.types';
import { TrackerStatsComponent } from '../../dumb/stats/tracker-stats.component/tracker-stats.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { TabEntry, TabListComponent } from '../../../../components/tab-list/tab-list.component';
import { EventFormComponent } from '../../dumb/event-form/event-form.component';

type Tabs = 'stats' | 'events';

@Component({
  imports: [
    EventListComponent,
    DateRangeSelectorComponent,
    ButtonComponent,
    ConfirmDialogComponent,
    TranslatePipe,
    DialogComponent,
    TrackerFormComponent,
    TrackerStatsComponent,
    TabListComponent,
    EventFormComponent,
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
      justify-content: space-between;
      align-items: start;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .header h2 {
      margin-bottom: 0;
    }
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
          [text]="'event.add' | translate"
          (clicked)="addEventDialogOpen.set(true)"
        ></app-button>
        <app-button
          [outlined]="true"
          variant="secondary"
          [text]="'tracker.delete' | translate"
          (clicked)="deleteDialogOpen.set(true)"
        ></app-button>
      </div>
    </div>
    <div class="toolbar">
      <div>
        <div role="group">
          <app-tab-list
            [tabs]="tabs"
            [selectedTab]="currentTab()"
            (tabChanged)="changeTab($event)"
          ></app-tab-list>
        </div>
      </div>
      <app-date-range-selector
        (changed)="dateRangeChanged($event)"
        [dateRange]="this.queryDateRange()"
      >
      </app-date-range-selector>
    </div>

    <div class="content" [aria-busy]="this.trackerEvents.isLoading()">
      @if (this.trackerEvents.hasValue() && this.tracker.hasValue()) {
        @if (this.currentTab() === 'stats') {
          <app-tracker-stats
            [tracker]="this.tracker.value()"
            [trackerEvents]="this.trackerEvents.value()"
            [dateRange]="this.queryDateRange()"
          ></app-tracker-stats>
        }
        @if (this.currentTab() === 'events') {
          <app-event-list
            [events]="trackerEvents.value()"
            (onDelete)="this.deleteEvent($event)"
          ></app-event-list>
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
      id="trackerEditDialog"
      [title]="addEventDialogTitle()"
      [title]="'tracker.edit' | translate"
      [open]="editDialogOpen()"
      (onClose)="editDialogOpen.set(false)"
    >
      <app-tracker-form
        [tracker]="this.tracker.value()"
        [typeDisabled]="true"
        (onFormSubmit)="updateTracker($event)"
      ></app-tracker-form>
    </app-dialog>

    <app-dialog
      id="eventAddDialog"
      [title]="addEventDialogTitle()"
      [open]="addEventDialogOpen()"
      (onClose)="addEventDialogOpen.set(false)"
    >
      <app-event-form
        [trackerType]="tracker.value()?.type ?? 'counter'"
        (onFormSubmit)="addEvent($event)"
      ></app-event-form>
    </app-dialog>
  `,
})
export class TrackerDetailComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly trackerApi = inject(TrackerApi);
  private readonly eventApi = inject(EventApi);
  private readonly routeQueryParams = toSignal(this.activatedRoute.queryParamMap, {
    requireSync: true,
  });

  public readonly tabs: TabEntry[] = [
    {
      translationId: 'tracker.tab.stats',
      value: 'stats',
    },
    {
      translationId: 'tracker.tab.events',
      value: 'events',
    },
  ];
  public readonly currentTab = computed<Tabs>(() => {
    const tab = this.routeQueryParams().get('tab');
    return (tab ?? 'stats') as Tabs;
  });

  public readonly trackerId = signal(this.activatedRoute.snapshot.params['id']);

  readonly deleteDialogOpen = signal(false);
  readonly editDialogOpen = signal(false);

  readonly addEventDialogOpen = signal(false);
  public addEventTranslated = translate('event.add');
  public addEventDialogTitle = computed<string>(() => {
    const currentTracker = this.tracker.value()?.name ?? '';
    return `${this.addEventTranslated()}: ${currentTracker}`;
  });

  public queryDateRange = computed<DateRange>(() => {
    const from = this.routeQueryParams().get('from');
    const to = this.routeQueryParams().get('to');
    const fromParsed = from ? new Date(from) : daysAgo(7);
    const toParsed = to ? new Date(to) : new Date();
    return {
      from: fromParsed,
      to: toParsed,
    };
  });
  public dateRange = linkedSignal({
    source: this.queryDateRange,
    computation: (dateRange) => {
      return dateRange;
    },
  });

  public tracker = this.trackerApi.getTracker(this.trackerId);
  public trackerEvents = this.eventApi.getTrackerEvents(this.trackerId, this.dateRange);

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

  addEvent(event: CreateTrackerEvent) {
    this.eventApi.addEvent(this.trackerId(), event).subscribe((updated) => {
      this.tracker.set(updated);
      this.trackerEvents.reload();
      this.addEventDialogOpen.set(false);
    });
  }

  changeTab(tab: string) {
    this.router.navigate([], {
      queryParams: { tab },
    });
  }
  dateRangeChanged(dateRange: DateRange) {
    const to = dateRange.to;
    const from = dateRange.from;
    this.router.navigate([], {
      queryParams: { from: from.toISOString(), to: to.toISOString() },
    });
    if (to) {
      to.setHours(23, 59, 59);
    }
    if (from) {
      from.setHours(0, 0, 0);
    }
    this.dateRange.set({
      from,
      to,
    });
  }
}
