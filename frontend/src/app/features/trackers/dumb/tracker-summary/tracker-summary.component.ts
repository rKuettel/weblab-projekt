import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-tracker-summary',
  styles: `
    .summary {
      /* Using Mono-Space Fonts defined in picocss: https://github.com/picocss/pico/blob/main/css/pico.jade.css */
      font-family:
        ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
      line-height: 1;
      font-weight: 700;
      display: block;
      white-space: nowrap;
    }
  `,
  template: `
    <span class="summary" [style.font-size]="fontSize()">
      {{ summary() }}
    </span>
  `,
})
export class TrackerSummaryComponent {
  readonly summary = input.required<number>();

  fontSize = computed(() => {
    const digits = this.summary().toString().length;
    // Divide by 0.6 since this is the recommended ratio between height and width of a monospaced font
    const size = Math.min(100 / digits / 0.6, 50);
    return `${size}cqw`;
  });
}
