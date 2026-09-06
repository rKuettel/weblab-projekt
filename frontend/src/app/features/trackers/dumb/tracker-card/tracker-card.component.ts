import { Component, computed, input, output } from '@angular/core';
import { Tracker } from '../../tracker.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [ButtonComponent, TranslatePipe],
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
      container-type: inline-size;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary {
      /* Using Mono-Space Fonts defined in picocss: https://github.com/picocss/pico/blob/main/css/pico.jade.css */
      font-family:
        ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
      line-height: 1;
      font-weight: 700;
      display: block;
      white-space: nowrap;
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
        <span class="summary" [style.font-size]="fontSize()">
          <!-- <span class="summary"> -->
          {{ tracker().summary }}
        </span>
      </div>
      <div class="footer">
        <app-button [fullWidth]="true" [text]="'tracker.view' | translate"> </app-button>
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
  readonly onAddEventClick = output<string>();

  fontSize = computed(() => {
    const digits = this.tracker().summary.toString().length;
    // Divide by 0.6 since this is the recommended ratio between height and width of a monospaced font
    const size = Math.min(100 / digits / 0.6, 50);
    return `${size}cqw`;
  });

  addEvent() {
    this.onAddEventClick.emit(this.tracker().id);
  }
}
