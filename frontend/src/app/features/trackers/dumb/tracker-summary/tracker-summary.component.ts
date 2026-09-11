import { Component, input } from '@angular/core';
import { Tracker } from '../../tracker.types';
import { BigNumberComponent } from '../../../../components/big-number/big-number.component';
import { PieChartComponent } from '../../../../components/charts/pie-chart/pie-chart.component';

@Component({
  imports: [BigNumberComponent, PieChartComponent],
  selector: 'app-tracker-summary',
  styles: `
    :host {
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      min-height: 0;
      flex: 1;
    }
  `,
  template: `
    @let tracker = this.tracker();
    @switch (tracker.type) {
      @case ('counter') {
        <app-big-number [number]="tracker.summary.sum"></app-big-number>
      }
      @case ('category') {
        <app-pie-chart [data]="{ source: tracker.summary }"></app-pie-chart>
      }
    }
  `,
})
export class TrackerSummaryComponent {
  readonly tracker = input.required<Tracker>();
}
