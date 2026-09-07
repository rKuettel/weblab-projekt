import {
  Component,
  input,
  linkedSignal,
  model,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { from } from 'rxjs';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [InputComponent, FormField],
  selector: 'app-date-range-selector',
  styles: `
    .form {
      display: flex;
      gap: 0.5rem;
    }
  `,
  template: `
    <div class="form">
      <app-input label="From" type="date" [formField]="dateRangeForm.from"></app-input>
      <app-input label="To" type="date" [formField]="dateRangeForm.to"></app-input>
    </div>
  `,
})
export class DateRangeSelectorComponent {
  dateRange = model.required<DateRange>();

  // formModel = linkedSignal({
  //   source: this.dateRange,
  //   computation: (source) => {
  //     return {
  //       from: toDateString(source.from),
  //       to: toDateString(source.to),
  //     };
  //   },
  // });

  dateRangeForm = form(this.dateRange);
}

export interface DateRange {
  from: string;
  to: string;
}
export interface DateRangeFormModel {
  from: string;
  to: string;
}

export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
