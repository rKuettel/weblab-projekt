import { Component, input, output } from '@angular/core';
import { Tracker } from '../../tracker.types';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  imports: [ButtonComponent],
  selector: 'app-tracker-card',
  styles: `
    :host {
      aspect-ratio: 1/1;
    }
    .card {
      aspect-ratio: 1/1;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;

      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }
    article {
      aspect-ratio: 1/1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .content {
      height: 100%;
    }
    .footer {
      display: flex;
      gap: 1rem;
    }
  `,
  template: `
    <div class="card">
      <h3>{{ tracker().name }}</h3>
      <div class="content">{{ tracker().summary }}</div>
      <div class="footer">
        <app-button text="View"></app-button>
        <app-button (clicked)="addEvent()" variant="secondary" text="Add Event"></app-button>
      </div>
    </div>
  `,
})
export class TrackerCardComponent {
  readonly tracker = input.required<Tracker>();
  readonly onAddEventClick = output<string>();

  addEvent() {
    this.onAddEventClick.emit(this.tracker().id);
  }
}
