import {
  Component,
  input,
  linkedSignal,
  model,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { from } from 'rxjs';
import { form, FormField, validate } from '@angular/forms/signals';
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
    validate(schema.to, ({ value, valueOf }) => {
      if (value() < valueOf(schema.from)) {
        console.log('invalidDateRange');
        return {
          kind: 'invalidDateRange',
          message: this.invalidDateRangeMessage(),
        };
      }

      return null;
    });
  });

  dateUpdated() {
    const form = this.dateRangeForm();

    if (form.valid()) {
      this.changed.emit(this.toDateRange(form.value()));
    }
  }

  toFormModel(range: DateRange): DateRangeFormModel {
    return {
      from: toDateString(range.from),
      to: toDateString(range.to),
    };
  }

  toDateRange(range: DateRangeFormModel): DateRange {
    const from = range.from.trim();
    const to = range.to.trim();
    return {
      from: from !== '' ? new Date(from) : undefined,
      to: to !== '' ? new Date(to) : undefined,
    };
  }
}
function toDateString(date?: Date): string {
  return date ? date.toISOString().split('T')[0] : '';
}

export interface DateRange {
  from?: Date;
  to?: Date;
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
