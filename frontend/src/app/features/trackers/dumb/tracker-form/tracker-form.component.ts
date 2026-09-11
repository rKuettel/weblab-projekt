import { Component, input, linkedSignal, output } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import { CreateTracker, DEFAULT_TRACKER, TRACKER_TYPES } from '../../tracker.types';
import { InputComponent } from '../../../../components/input/input.component';
import { TitleCasePipe } from '@angular/common';
import { ButtonComponent } from '../../../../components/button/button.component';
import { translate, TranslatePipe } from '@ngx-translate/core';
import { requiredTrimmed } from '../../../../services/requiredTrimmed.validator';

@Component({
  imports: [FormField, InputComponent, TitleCasePipe, TranslatePipe, ButtonComponent],
  selector: 'app-tracker-form',
  styles: ``,
  template: `
    <form class="tracker-form" (submit)="submitForm($event)">
      <div>
        <app-input
          [label]="this.nameLabel()"
          type="text"
          [formField]="trackerForm.name"
        ></app-input>
      </div>

      <div>
        <label for="type">
          {{ 'tracker.form.type' | translate }}
          <select id="type" [formField]="trackerForm.type">
            @for (type of types; track type) {
              <option [value]="type">{{ type | titlecase }}</option>
            }
          </select>
        </label>
      </div>

      <app-button
        [text]="'button.submit' | translate"
        [fullWidth]="true"
        variant="primary"
        type="submit"
        [disabled]="!trackerForm().valid()"
      />
    </form>
  `,
})
export class TrackerFormComponent {
  readonly onFormSubmit = output<CreateTracker>();
  readonly types = Object.values(TRACKER_TYPES);
  readonly nameLabel = translate('tracker.form.name');

  readonly tracker = input<CreateTracker>();
  readonly typeDisabled = input(false);
  private readonly trackerModel = linkedSignal(() => this.tracker() ?? { ...DEFAULT_TRACKER });

  readonly trackerForm = form(this.trackerModel, (path) => {
    disabled(path.type, { when: ({}) => this.typeDisabled() });
    requiredTrimmed(
      path.name,
      translate('validation.required', () => ({
        field: this.nameLabel(),
      })),
    );
  });

  submitForm(event: Event) {
    console.log('test');
    event.preventDefault();
    const trackerForm = this.trackerForm();

    if (trackerForm.valid()) {
      console.log('emitting');

      this.onFormSubmit.emit({ ...trackerForm.value() });
      this.trackerForm().reset({
        ...DEFAULT_TRACKER,
      });
    }
  }
}
