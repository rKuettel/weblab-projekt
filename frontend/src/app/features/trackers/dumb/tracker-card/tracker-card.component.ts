import { Component, input } from '@angular/core';
import { Tracker } from '../../tracker.types';
import { ButtonComponent } from '../../../../components/button/button.component';

@Component({
  imports: [ButtonComponent],
  selector: 'app-tracker-card',
  styles: ``,
  template: `
    <article>
      <header>
        <h3>{{ tracker().name }}</h3>
      </header>
      <p>test</p>
      <footer class="grid">
        <!-- <button>View</button> -->
        <!-- <button class="secondary">Add Event</button> -->
        <app-button class="container" text="View"></app-button>
        <app-button variant="secondary" text="Add Event"></app-button>
      </footer>
    </article>
  `,
})
export class TrackerCardComponent {
  readonly tracker = input.required<Tracker>();
}
