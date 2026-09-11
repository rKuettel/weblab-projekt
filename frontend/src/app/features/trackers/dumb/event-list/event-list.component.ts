import { Component, computed, input, output, signal } from '@angular/core';
import { TrackerEvent } from '../../events.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [ButtonComponent, ConfirmDialogComponent, TranslatePipe],
  selector: 'app-event-list',
  styles: `
    section {
      border:;
    }
  `,
  template: `
    @for (
      event of [...this.events()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      track event.id
    ) {
      <div class="event" [attr.data-testid]="'event' + event.id">
        <p>Timestamp: {{ event.timestamp }}</p>
        <p>Data: {{ this.toJson(event.data) }}</p>
        <app-button
          (clicked)="eventIdToDelete.set(event.id)"
          variant="secondary"
          [text]="'event.delete' | translate"
        ></app-button>
      </div>

      <hr />
    }

    <app-confirm-dialog
      [open]="this.dialogOpen()"
      (onClose)="eventIdToDelete.set(undefined)"
      (confirmed)="emitOnDelete()"
      [title]="'event.confirmDelete' | translate"
      [text]="'event.confirmDeleteLong' | translate"
    ></app-confirm-dialog>
  `,
})
export class EventListComponent {
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

  toJson(test: any): string {
    return JSON.stringify(test);
  }
}
