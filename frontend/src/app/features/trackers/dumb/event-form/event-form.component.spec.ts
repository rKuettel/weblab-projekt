import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { CreateTrackerEvent } from '../../events.types';
import { EventFormComponent } from './event-form.component';
import { inputBinding, signal } from '@angular/core';
import { TrackerType } from '../../tracker.types';
const translations = {
  button: {
    submit: 'Submit',
  },
};

describe('EventForm', () => {
  async function setup(trackerType: TrackerType = 'counter') {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(EventFormComponent, {
      bindings: [inputBinding('trackerType', signal(trackerType))],
    });
    TestBed.inject(TranslateService).setTranslation('en', translations);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      inputs: fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>,
      submitButton: fixture.nativeElement.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement,
    };
  }

  function setNativeValue(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
  }

  it('should render timestamp, delta and submit controls when couter event', async () => {
    const { fixture, inputs, submitButton } = await setup();

    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels[0].textContent).toContain('Timestamp');
    expect(labels[1].textContent).toContain('Delta');

    expect(inputs[0].type).toBe('datetime-local');
    expect(inputs[1].type).toBe('number');
    expect(inputs[1].value).toBe('1');

    expect(submitButton.textContent?.trim()).toBe('Submit');
    expect(submitButton.disabled).toBe(false);
  });

  it('should render timestamp, category, amount  and submit controls when category event', async () => {
    const { fixture, inputs, submitButton } = await setup('category');

    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels[0].textContent).toContain('Timestamp');
    expect(inputs[0].type).toBe('datetime-local');

    expect(labels[1].textContent).toContain('Category');
    expect(inputs[1].type).toBe('text');

    expect(labels[2].textContent).toContain('Amount');
    expect(inputs[2].type).toBe('number');
    expect(inputs[2].value).toBe('0');

    expect(submitButton.textContent?.trim()).toBe('Submit');
    expect(submitButton.disabled).toBe(false);
  });

  it('should emit the entered counter event on submit', async () => {
    const { component, inputs, submitButton } = await setup();
    const onFormSubmit = vi.fn();
    component.onFormSubmit.subscribe(onFormSubmit);

    setNativeValue(inputs[0], '2024-05-01T10:30');
    setNativeValue(inputs[1], '5');
    submitButton.click();

    expect(onFormSubmit).toHaveBeenCalledOnce();
    const emitted: CreateTrackerEvent = onFormSubmit.mock.calls[0][0];
    expect(emitted).toEqual({
      timestamp: new Date('2024-05-01T10:30'),
      data: { delta: 5 },
    });
  });

  it('should emit the entered category event on submit', async () => {
    const { component, inputs, submitButton } = await setup('category');
    const onFormSubmit = vi.fn();
    component.onFormSubmit.subscribe(onFormSubmit);

    setNativeValue(inputs[0], '2024-05-01T10:30');
    setNativeValue(inputs[1], 'test');
    submitButton.click();

    expect(onFormSubmit).toHaveBeenCalledOnce();
    const emitted: CreateTrackerEvent = onFormSubmit.mock.calls[0][0];
    expect(emitted).toEqual({
      timestamp: new Date('2024-05-01T10:30'),
      data: { category: 'test', amount: 0 },
    });
  });
});
