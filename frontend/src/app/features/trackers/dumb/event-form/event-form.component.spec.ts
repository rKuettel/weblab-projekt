import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { CreateTrackerEvent } from '../../events.types';
import { EventFormComponent } from './event-form.component';
const translations = {
  button: {
    submit: 'Submit',
  },
};

describe('EventForm', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(EventFormComponent);
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

  it('should render timestamp, delta and submit controls', async () => {
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

  it('should emit the entered event on submit', async () => {
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
      type: 'counter',
      data: { delta: 5 },
    });
  });
});
