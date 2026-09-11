import { Component, input, output } from '@angular/core';
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
      min-height: 0;
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }

    .card {
      aspect-ratio: 1/1;
      min-height: 0;
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }

    .footer {
      display: flex;
      gap: 1rem;
    }
  `,
  template: `
    <article class="card">
      <h3>{{ tracker().name }}</h3>
      <app-tracker-summary [tracker]="tracker()"></app-tracker-summary>
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
    </article>
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
