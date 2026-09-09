import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { CreateTracker } from '../../tracker.types';
import { TrackerFormComponent } from './tracker-form.component';
const translations = {
  button: {
    submit: 'Submit',
  },
  validation: {
    required: '{{ field }} is required',
  },
  tracker: {
    form: {
      name: 'Name',
      type: 'Type',
    },
  },
};

describe('TrackerForm', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [TrackerFormComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrackerFormComponent);
    TestBed.inject(TranslateService).setTranslation('en', translations);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      nameInput: fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement,
      typeSelect: fixture.nativeElement.querySelector('select') as HTMLSelectElement,
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

  it('should render name, type and submit controls', async () => {
    const { fixture, typeSelect } = await setup();

    const nameLabel = fixture.nativeElement.querySelector('label');
    expect(nameLabel?.textContent).toContain('Name');

    const typeLabel = fixture.nativeElement.querySelector('[for="type"');
    expect(typeLabel?.textContent).toContain('Type');

    expect(typeSelect.options.length).toBe(1);
    expect(typeSelect.options[0].value).toBe('counter');
    expect(typeSelect.options[0].textContent).toBe('Counter');
  });

  it('should keep the submit button disabled when form is invalid', async () => {
    const { submitButton, component } = await setup();

    expect(component.trackerForm().valid()).toBe(false);
    expect(submitButton.disabled).toBe(true);
  });

  it('should show the required error for an empty name', async () => {
    const { fixture } = await setup();

    expect(fixture.nativeElement.querySelector('[data-testid="error-Name"]')?.textContent).toBe(
      'Name is required',
    );
  });

  it('should submit a valid tracker and reset the form', async () => {
    const { fixture, component, nameInput, submitButton } = await setup();
    const onFormSubmit = vi.fn();
    component.onFormSubmit.subscribe(onFormSubmit);

    setNativeValue(nameInput, 'My Tracker');
    fixture.detectChanges();
    expect(submitButton.disabled).toBe(false);

    submitButton.click();
    fixture.detectChanges();

    expect(onFormSubmit).toHaveBeenCalledOnce();
    const emitted: CreateTracker = onFormSubmit.mock.calls[0][0];
    expect(emitted).toEqual({ name: 'My Tracker', type: 'counter' });

    expect(nameInput.value).toBe('');
    expect(submitButton.disabled).toBe(true);
  });
});
