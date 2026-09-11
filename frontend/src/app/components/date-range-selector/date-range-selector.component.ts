import { Component, input, linkedSignal, output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { translate, TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [InputComponent, FormField, TranslatePipe],
  selector: 'app-date-range-selector',
  styles: `
    .form {
      display: flex;
      gap: 0.5rem;
    }
  `,
  template: `
    <div class="form">
      <app-input
        [label]="'dateRangeSelector.from' | translate"
        (change)="dateUpdated()"
        type="date"
        [formField]="dateRangeForm.from"
      ></app-input>
      <app-input
        [label]="'dateRangeSelector.to' | translate"
        (change)="dateUpdated()"
        type="date"
        [formField]="dateRangeForm.to"
      ></app-input>
    </div>
  `,
})
export class DateRangeSelectorComponent {
  dateRange = input.required<DateRange>();
  changed = output<DateRange>();
  dateRangeFormModel = linkedSignal({
    source: this.dateRange,
    computation: this.toFormModel,
  });
  private invalidDateRangeMessage = translate('dateRangeSelector.invalidDateRange');

  dateRangeForm = form(this.dateRangeFormModel, (schema) => {
    (required(schema.from),
      required(schema.to),
      validate(schema.to, ({ value, valueOf }) => {
        if (value() < valueOf(schema.from)) {
          console.log('invalidDateRange');
          return {
            kind: 'invalidDateRange',
            message: this.invalidDateRangeMessage(),
          };
        }

        return null;
      }));
  });

  dateUpdated() {
    const form = this.dateRangeForm();

    if (form.valid()) {
      this.changed.emit(this.toDateRange(form.value()));
    }
  }

  private toFormModel(range: DateRange): DateRangeFormModel {
    return {
      from: toDateString(range.from),
      to: toDateString(range.to),
    };
  }

  private toDateRange(range: DateRangeFormModel): DateRange {
    const from = range.from.trim();
    const to = range.to.trim();
    return {
      from: new Date(from),
      to: new Date(to),
    };
  }
}
function toDateString(date?: Date): string {
  return date ? date.toISOString().split('T')[0] : '';
}

export interface DateRange {
  from: Date;
  to: Date;
}
interface DateRangeFormModel {
  from: string;
  to: string;
}

export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
