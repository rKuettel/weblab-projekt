import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { CreateTracker } from '../../tracker.types';
import { ButtonComponent } from '../../../../components/button/button.component';
import { InputComponent } from '../../../../components/input/input.component';
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
  async function setup(inputs: { tracker?: CreateTracker; typeDisabled?: boolean } = {}) {
    await TestBed.configureTestingModule({
      imports: [TrackerFormComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrackerFormComponent, {
      bindings: [
        inputBinding('tracker', signal(inputs.tracker)),
        inputBinding('typeDisabled', signal(inputs.typeDisabled ?? false)),
      ],
    });
    TestBed.inject(TranslateService).setTranslation('en', translations);
    fixture.detectChanges();

    const nameInputEl = fixture.debugElement.query(By.directive(InputComponent));
    const submitButtonEl = fixture.debugElement.query(By.directive(ButtonComponent));

    return {
      fixture,
      component: fixture.componentInstance,
      nameInputComponent: nameInputEl.componentInstance as InputComponent<string>,
      typeSelect: fixture.nativeElement.querySelector('select') as HTMLSelectElement,
      submitButton: submitButtonEl.componentInstance as ButtonComponent,
    };
  }

  it('should render name, type and submit controls', async () => {
    const { fixture, nameInputComponent, typeSelect } = await setup();

    expect(nameInputComponent.label()).toBe('Name');

    const typeLabel = fixture.nativeElement.querySelector('[for="type"');
    expect(typeLabel?.textContent).toContain('Type');

    expect(typeSelect.options.length).toBe(2);
    expect(typeSelect.options[0].value).toBe('counter');
    expect(typeSelect.options[0].textContent).toBe('Counter');
    expect(typeSelect.options[1].value).toBe('category');
    expect(typeSelect.options[1].textContent).toBe('Category');
  });

  it('should keep the submit button disabled when form is invalid', async () => {
    const { submitButton, component } = await setup();

    expect(component.trackerForm().valid()).toBe(false);
    expect(submitButton.disabled()).toBe(true);
  });

  it('should show the required error for an empty name', async () => {
    const { fixture } = await setup();

    expect(fixture.nativeElement.querySelector('[data-testid="error-Name"]')?.textContent).toBe(
      'Name is required',
    );
  });

  it('should prefill the name when editing an existing tracker', async () => {
    const { nameInputComponent } = await setup({
      tracker: { name: 'Steps', type: 'counter' },
    });

    expect(nameInputComponent.formField()().value()).toBe('Steps');
  });

  it('should disable the type when typeDisabled', async () => {
    const { component } = await setup({
      typeDisabled: true,
    });

    expect(component.trackerForm.type().disabled()).toBe(true);
  });

  it('should submit a valid tracker and reset the form', async () => {
    const { fixture, nameInputComponent, component, submitButton } = await setup();
    const onFormSubmit = vi.fn();
    component.onFormSubmit.subscribe(onFormSubmit);

    nameInputComponent.formField()().value.set('My Tracker');
    fixture.detectChanges();
    expect(submitButton.disabled()).toBe(false);

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.requestSubmit();
    fixture.detectChanges();

    expect(onFormSubmit).toHaveBeenCalledOnce();
    const emitted: CreateTracker = onFormSubmit.mock.calls[0][0];
    expect(emitted).toEqual({ name: 'My Tracker', type: 'counter' });

    expect(nameInputComponent.formField()().value()).toBe('');
    expect(submitButton.disabled()).toBe(true);
  });
});
