import { Component, computed, inject, signal } from '@angular/core';
import { CreateTracker, Tracker } from '../../tracker.types';
import { TrackerCardComponent } from '../../dumb/tracker-card/tracker-card.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { EventFormComponent } from '../../dumb/event-form/event-form.component';
import { EventApi } from '../../services/api/event.api';
import { CreateTrackerEvent } from '../../events.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { translate, TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [
    TrackerCardComponent,
    TrackerFormComponent,
    EventFormComponent,
    ButtonComponent,
    DialogComponent,
    TranslatePipe,
  ],
  selector: 'app-tracker-dashboard',
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
    <div
      [class.modal-is-opening]="isAddEventModalOpen() || isAddTrackerModalOpen()"
      [class.modal-is-open]="isAddEventModalOpen() || isAddTrackerModalOpen()"
    >
      <div class="header">
        <h2>Trackers</h2>
        <app-button
          data-testid="add-tracker-btn"
          [text]="'tracker.add' | translate"
          (clicked)="this.isAddTrackerModalOpen.set(true)"
        ></app-button>
      </div>
      <div class="dashboard">
        @for (tracker of this.trackers.value(); track tracker.id) {
          <app-tracker-card
            [tracker]="tracker"
            (onAddEventClick)="changeCurrentTracker(tracker)"
          ></app-tracker-card>
        }

        <app-dialog
          [title]="'tracker.add' | translate"
          [open]="isAddTrackerModalOpen()"
          (onClose)="isAddTrackerModalOpen.set(false)"
        >
          <app-tracker-form (onFormSubmit)="addTracker($event)"></app-tracker-form>
        </app-dialog>

        <app-dialog
          [title]="addEventModalTitle()"
          [open]="isAddEventModalOpen()"
          (onClose)="this.currentTracker.set(undefined)"
        >
          <app-event-form
            [trackerType]="currentTracker()?.type ?? 'counter'"
            (onFormSubmit)="addEvent($event)"
          ></app-event-form>
        </app-dialog>
      </div>
    </div>
  `,
})
export class TrackerDashboardComponent {
  private api = inject(TrackerApi);
  private eventApi = inject(EventApi);
  public trackers = this.api.getTrackers();
  public currentTracker = signal<Tracker | undefined>(undefined);

  public isAddTrackerModalOpen = signal(false);
  public isAddEventModalOpen = computed<boolean>(() => !!this.currentTracker());

  public addEventTranslated = translate('event.add');
  public addEventModalTitle = computed<string>(() => {
    const currentTracker = this.currentTracker()?.name ?? '';
    return `${this.addEventTranslated()}: ${currentTracker}`;
  });

  addTracker(tracker: CreateTracker) {
    console.log('Creating new Tracker: ', tracker);
    this.api.createTracker(tracker).subscribe((t) => {
      console.log('Run update: ', t);
      this.trackers.update((trackers) => [...trackers, t]);

      console.log('Length: ', this.trackers.value().length);
    });

    this.isAddTrackerModalOpen.set(false);
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
    this.currentTracker.set(undefined);
  }

  changeCurrentTracker(event: Tracker) {
    this.currentTracker.set(event);
  }
}
