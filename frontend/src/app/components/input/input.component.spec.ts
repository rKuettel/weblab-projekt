import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';
import { InputComponent } from './input.component';

interface Model {
  name: string;
}

describe('Input', () => {
  async function setup(props: Partial<{ label: string; type: string; name: string }> = {}) {
    const label = props.label ?? 'Name';
    const type = props.type ?? 'text';
    const model = signal<Model>({ name: props.name ?? '' });

    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    const formRef = TestBed.runInInjectionContext(() =>
      form(model, (schema) => required(schema.name, { message: 'Name is required' })),
    );

    const fixture = TestBed.createComponent(InputComponent<string>, {
      bindings: [
        inputBinding('label', signal(label)),
        inputBinding('type', signal(type)),
        inputBinding('formField', signal(formRef.name)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      model,
    };
  }

  it('should render the label and an input with the given type', async () => {
    const { fixture } = await setup({ type: 'email' });

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Name');
    expect(fixture.nativeElement.querySelector('input')?.type).toBe('email');
  });

  it('should show the error message and mark the input invalid while the value is empty', async () => {
    const { fixture } = await setup();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('[data-testid="error-Name"')?.textContent).toBe(
      'Name is required',
    );
  });

  it('should remove the error once the value is valid', async () => {
    const { fixture, model } = await setup();

    model.set({ name: 'abc' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input')?.getAttribute('aria-invalid')).toBe(
      'false',
    );
    expect(fixture.nativeElement.querySelector('[data-testid="error-Name"')).toBeNull();
  });
});
