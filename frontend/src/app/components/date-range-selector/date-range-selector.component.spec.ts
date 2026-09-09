import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { DateRange, DateRangeSelectorComponent } from './date-range-selector.component';

const translations = {
  dateRangeSelector: {
    from: 'Start Date',
    to: 'End Date',
    invalidDateRange: 'End date must be after start date',
  },
};

const DEFAULT_RANGE: DateRange = {
  from: new Date('2024-01-01'),
  to: new Date('2024-01-31'),
};

describe('DateRangeSelector', () => {
  async function setup(range: DateRange = DEFAULT_RANGE) {
    const rangeSignal = signal(range);

    await TestBed.configureTestingModule({
      imports: [DateRangeSelectorComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(DateRangeSelectorComponent, {
      bindings: [inputBinding('dateRange', rangeSignal)],
    });
    TestBed.inject(TranslateService).setTranslation('en', translations);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      rangeSignal,
      inputs: fixture.nativeElement.querySelectorAll(
        'input[type="date"]',
      ) as NodeListOf<HTMLInputElement>,
    };
  }

  function setDateInput(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
  }

  it('should render date inputs with initial range', async () => {
    const { fixture, inputs } = await setup();

    expect(inputs.length).toBe(2);
    expect(inputs[0].value).toBe('2024-01-01');
    expect(inputs[1].value).toBe('2024-01-31');

    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels[0].textContent).toContain('Start Date');
    expect(labels[1].textContent).toContain('End Date');
  });

  it('should update the form when the dateRange input changes', async () => {
    const { fixture, inputs, rangeSignal } = await setup();

    rangeSignal.set({
      from: new Date('2024-03-01'),
      to: new Date('2024-03-15'),
    });
    fixture.detectChanges();

    expect(inputs[0].value).toBe('2024-03-01');
    expect(inputs[1].value).toBe('2024-03-15');
  });

  it('should show an error and not emit changed when the end date is before the start date', async () => {
    const { fixture, component, inputs } = await setup();
    const changed = vi.fn();
    component.changed.subscribe(changed);

    setDateInput(inputs[1], '2023-12-31');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="error-End Date"]')?.textContent).toBe(
      'End date must be after start date',
    );
    expect(changed).not.toHaveBeenCalled();
  });

  it('should emit changed with a valid date range', async () => {
    const { fixture, component, inputs } = await setup();
    const changed = vi.fn();
    component.changed.subscribe(changed);

    setDateInput(inputs[1], '2024-02-15');
    fixture.detectChanges();

    expect(changed).toHaveBeenCalledOnce();
    expect(changed).toHaveBeenCalledWith({
      from: new Date('2024-01-01'),
      to: new Date('2024-02-15'),
    });
  });
});
