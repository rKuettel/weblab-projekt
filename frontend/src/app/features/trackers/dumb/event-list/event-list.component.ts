import { Component, computed, input, output, signal } from '@angular/core';
import { TrackerEvent } from '../../events.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [ButtonComponent, ConfirmDialogComponent, TranslatePipe],
  selector: 'app-event-list',
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .event-data {
      margin-bottom: 0;
    }
    .data-label {
      font-weight: 600;
    }
  `,
  template: `
    @for (
      event of [...this.events()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      track event.id
    ) {
      <article class="event" [attr.data-testid]="'event-' + event.id">
        <header>
          @let timestamp = event.timestamp;
          <strong>{{ formatDate(timestamp) }}</strong>
          <app-button
            (clicked)="eventIdToDelete.set(event.id)"
            [outlined]="true"
            variant="secondary"
            [text]="'event.delete' | translate"
          ></app-button>
        </header>

        <ul class="event-data">
          @for (entry of entries(event.data); track $index) {
            <li class="data-item" data-testid="event-data-item">
              <span class="data-label">{{ entry[0] }}: </span>
              <span class="data-value">{{ entry[1] }}</span>
            </li>
          }
        </ul>
      </article>
    }

    <app-confirm-dialog
      testId="delete-event-confirm-dialog"
      [open]="this.dialogOpen()"
      (onClose)="eventIdToDelete.set(undefined)"
      (confirmed)="emitOnDelete()"
      [title]="'event.confirmDelete' | translate"
      [text]="'event.confirmDeleteLong' | translate"
    ></app-confirm-dialog>
  `,
})
export class EventListComponent {
  private dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  readonly events = input.required<TrackerEvent[]>();
  readonly onDelete = output<string>();

  readonly eventIdToDelete = signal<string | undefined>(undefined);
  readonly dialogOpen = computed(() => !!this.eventIdToDelete());

  emitOnDelete() {
    const id = this.eventIdToDelete();
    if (id) {
      this.onDelete.emit(id);
      this.eventIdToDelete.set(undefined);
    }
  }

  formatDate(date: Date): string {
    return this.dateTimeFormat.format(date);
  }

  entries(data: any): [string, unknown][] {
    return Object.entries(data);
  }
}
