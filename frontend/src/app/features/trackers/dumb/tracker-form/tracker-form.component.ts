import { Component, computed, output, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { CreateTracker, DEFAULT_TRACKER, TRACKER_TYPES } from '../../tracker.types';
import { InputComponent } from '../../../../components/input-field-error/input-field-error';
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
          [label]="'tracker.form.name' | translate"
          type="text"
          [formField]="trackerForm.name"
        ></app-input>
      </div>

      <div>
        <label for="type">
          {{ this.nameLabel() }}
          <select id="type" [formField]="trackerForm.type">
            @for (type of types; track type) {
              <option [value]="type">{{ type | titlecase }}</option>
            }
          </select>
        </label>
      </div>

      <app-button
        [text]="'button.submit' | translate"
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

  private readonly trackerModel = signal<CreateTracker>({ ...DEFAULT_TRACKER });

  readonly trackerForm = form(this.trackerModel, (path) => {
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
