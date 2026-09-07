import { Component, computed, input, output } from '@angular/core';
import { Tracker } from '../../tracker.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TrackerSummaryComponent } from '../tracker-summary/tracker-summary.component';

@Component({
  imports: [ButtonComponent, TrackerSummaryComponent, TranslatePipe, RouterLink],
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
      container-type: inline-size;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footer {
      display: flex;
      gap: 1rem;
    }
  `,
  template: `
    <div class="card">
      <h3>{{ tracker().name }}</h3>
      <div class="content">
        <app-tracker-summary [summary]="tracker().summary"></app-tracker-summary>
      </div>
      <div class="footer">
        <app-button
          [fullWidth]="true"
          [routerLink]="['tracker', this.tracker().id]"
          [text]="'tracker.view' | translate"
        >
        </app-button>
        <app-button
          [fullWidth]="true"
          (clicked)="addEvent()"
          variant="secondary"
          [text]="'event.add' | translate"
        ></app-button>
      </div>
    </div>
  `,
})
export class TrackerCardComponent {
  readonly tracker = input.required<Tracker>();
  readonly onViewClick = output<string>();
  readonly onAddEventClick = output<string>();

  addEvent() {
    this.onAddEventClick.emit(this.tracker().id);
  }

  viewClicked() {
    this.onViewClick.emit(this.tracker().id);
  }
}
