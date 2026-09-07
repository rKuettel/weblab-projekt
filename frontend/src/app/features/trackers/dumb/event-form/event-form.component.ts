import { Component, output, signal } from '@angular/core';
import { CreateTrackerEvent, TrackerEventData } from '../../events.types';
import { form, FormField } from '@angular/forms/signals';
import { InputComponent } from '../../../../components/input/input.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TranslatePipe } from '@ngx-translate/core';

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

      <app-input label="Delta" type="number" [formField]="eventForm.data.delta"></app-input>

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
  readonly onFormSubmit = output<CreateTrackerEvent>();

  private readonly eventModel = signal<EventFormModel>({ ...DEFAULT_TRACKEREVENT });

  readonly eventForm = form(this.eventModel, (path) => {});

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
    const test: Date = new Date(model.timestamp);

    return {
      ...model,
      timestamp: test,
    };
  }
}

interface EventFormModel {
  timestamp: string;
  type: string;
  data: TrackerEventData;
}

const DEFAULT_TRACKEREVENT: EventFormModel = {
  timestamp: currentDateTime(),
  type: 'counter',
  data: {
    delta: 1,
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
