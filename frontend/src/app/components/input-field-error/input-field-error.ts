import { Component, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [FormField],
  template: `
    <label>
      {{ this.label() }}
      <input
        [type]="this.type()"
        [formField]="this.formField()"
        [ariaInvalid]="formField()().invalid()"
      />
      @for (error of formField()().errors(); track error) {
        <small>{{ error.message }}</small>
      }
    </label>
  `,
  styles: `
    .error {
      color: #b3261e;
      font-size: 0.8rem;
    }
  `,
})
export class InputComponent<T extends string | number> {
  readonly label = input.required<string>();
  readonly type = input.required<string>();
  readonly formField = input.required<Field<T>>();
  // [ariaInvalid]="formField()().invalid()"
}
