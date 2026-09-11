import { Component, input, output, signal } from '@angular/core';
import {
  CategoryEventData,
  CounterEventData,
  CreateTrackerEvent,
  TrackerEventData,
} from '../../events.types';
import { form, FormField, hidden } from '@angular/forms/signals';
import { InputComponent } from '../../../../components/input/input.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TrackerType } from '../../tracker.types';

@Component({
  imports: [InputComponent, ButtonComponent, FormField, TranslatePipe],
  selector: 'app-event-form',
  styles: ``,
  template: `
    <form class="tracker-form" (submit)="submitForm($event)">
      <app-input
        label="Timestamp"
        type="datetime-local"
        [formField]="eventForm.timestamp"
      ></app-input>

      <app-input label="Delta" type="number" [formField]="eventForm.couterData.delta"></app-input>

      <app-input
        label="Category"
        type="string"
        [formField]="eventForm.categoryData.category"
      ></app-input>

      <app-input
        label="Amount"
        type="number"
        [formField]="eventForm.categoryData.amount"
      ></app-input>

      <app-button
        [text]="'button.submit' | translate"
        [fullWidth]="true"
        variant="primary"
        type="submit"
        [disabled]="!eventForm().valid()"
      />
    </form>
  `,
})
export class EventFormComponent {
  readonly trackerType = input.required<TrackerType>();
  readonly onFormSubmit = output<CreateTrackerEvent>();

  private readonly eventModel = signal<EventFormModel>({ ...DEFAULT_TRACKEREVENT });

  readonly eventForm = form(this.eventModel, (path) => {
    hidden(path.categoryData.amount, { when: ({}) => this.trackerType() !== 'category' });
    hidden(path.categoryData.category, { when: ({}) => this.trackerType() !== 'category' });
    hidden(path.couterData, { when: ({}) => this.trackerType() !== 'counter' });
  });

  submitForm(event: Event) {
    console.log('test');
    event.preventDefault();
    const eventForm = this.eventForm();

    if (eventForm.valid()) {
      console.log('emitting');

      this.onFormSubmit.emit(this.toModel(eventForm.value()));
      this.eventForm().reset({
        ...DEFAULT_TRACKEREVENT,
      });
    }
  }

  toModel(model: EventFormModel): CreateTrackerEvent {
    const timestamp: Date = new Date(model.timestamp);

    let data: TrackerEventData;
    const eventType = this.trackerType();
    if (eventType === 'counter') {
      data = model.couterData;
    } else {
      data = model.categoryData;
    }

    return {
      data,
      timestamp: timestamp,
    };
  }
}

interface EventFormModel {
  timestamp: string;
  couterData: CounterEventData;
  categoryData: CategoryEventData;
}

const DEFAULT_TRACKEREVENT: EventFormModel = {
  timestamp: currentDateTime(),
  couterData: {
    delta: 1,
  },
  categoryData: {
    category: '',
    amount: 0,
  },
};

function currentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}T${hour}:${minutes}`;
  console.log(formatted);
  return formatted;
}
