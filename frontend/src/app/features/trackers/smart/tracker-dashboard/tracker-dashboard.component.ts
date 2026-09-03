import { Component } from '@angular/core';
import { DEFAULT_TRACKER } from '../../tracker.types';
import { TrackerCardComponent } from '../../dumb/tracker-card/tracker-card.component';

@Component({
  imports: [TrackerCardComponent],
  selector: 'app-tracker-dashboard',
  styles: `
    .dashboard {
      display: grid;
      grid-template-columns: 1fr;
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
    <div class="grid dashboard">
      @for (tracker of this.trackers; track $index) {
        <app-tracker-card [tracker]="tracker"></app-tracker-card>
      }
      <button class="outline">Add New Tracker</button>
    </div>
  `,
})
export class TrackerDashboardComponent {
  public trackers = [
    { ...DEFAULT_TRACKER },
    { ...DEFAULT_TRACKER },
    { ...DEFAULT_TRACKER },
    { ...DEFAULT_TRACKER },
    { ...DEFAULT_TRACKER },
  ];
}
