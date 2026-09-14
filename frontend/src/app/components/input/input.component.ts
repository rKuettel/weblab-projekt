import { Component, computed, input, output } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [FormField],
  styles: `
    :host {
      margin: 0;
      padding: 0 !important;
    }
  `,
  template: `
    @if (!this.formField()().hidden()) {
      <label>
        {{ this.label() }}
        <input
          [attr.data-testid]="testId()"
          [attr.list]="dataListId()"
          [type]="this.type()"
          [formField]="this.formField()"
          [ariaInvalid]="formField()().invalid()"
          (change)="change.emit()"
        />

        @for (error of formField()().errors(); track error) {
          <small [attr.data-testid]="'error-' + this.label()">{{ error.message }}</small>
        }
        @if (this.dataListItems()) {
          <datalist [id]="dataListId()">
            @for (item of this.dataListItems(); track item) {
              <option [value]="item"></option>
            }
          </datalist>
        }
      </label>
    }
  `,
})
export class InputComponent<T extends string | number> {
  readonly label = input.required<string>();
  readonly type = input.required<string>();
  readonly formField = input.required<Field<T>>();
  readonly dataListItems = input<string[]>();
  readonly testId = input<string>();

  readonly change = output<void>();

  readonly dataListId = computed(() => {
    return this.dataListItems() ? this.formField()().name() : undefined;
  });
}
