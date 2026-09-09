import { Component, input, output } from '@angular/core';
import { TrackerEvent } from '../../events.types';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  imports: [ButtonComponent],
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
      <div class="event">
        <p>Timestamp: {{ event.timestamp }}</p>
        <p>Data: {{ event.data.delta }}</p>
        <app-button
          (clicked)="onDelete.emit(event.id)"
          variant="secondary"
          text="Delete"
        ></app-button>
      </div>

      <hr />
    }
  `,
})
export class EventListComponent {
  readonly events = input.required<TrackerEvent[]>();
  readonly onDelete = output<string>();
}
