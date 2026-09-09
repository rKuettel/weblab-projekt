import { inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ButtonComponent, ButtonType, ButtonVariant } from './button.component';

describe('Button', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  async function setup(props: Partial<Props> = {}) {
    const mergedProps: Props = {
      text: 'Click',
      variant: 'primary',
      outlined: false,
      fullWidth: false,
      type: 'button',
      disabled: false,
      ...props,
    };

    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent, {
      bindings: [
        inputBinding('text', signal(mergedProps.text)),
        inputBinding('variant', signal(mergedProps.variant)),
        inputBinding('outlined', signal(mergedProps.outlined)),
        inputBinding('fullWidth', signal(mergedProps.fullWidth)),
        inputBinding('type', signal(mergedProps.type)),
        inputBinding('disabled', signal(mergedProps.disabled)),
        inputBinding('ariaLabel', signal(mergedProps.ariaLabel)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      button: fixture.nativeElement.querySelector('button') as HTMLButtonElement,
    };
  }

  it('should render the text with the selected variant and emit clicks', async () => {
    const { component, button } = await setup({ variant: 'secondary', outlined: true });
    const clicked = vi.fn();
    component.clicked.subscribe(clicked);

    expect(button.textContent?.trim()).toBe('Click');
    expect(button.classList).toContain('secondary');
    expect(button.classList).toContain('outline');
    expect(button.classList).not.toContain('primary');

    button.click();

    expect(clicked).toHaveBeenCalledOnce();
  });

  it('should not emit clicks while disabled', async () => {
    const { component, button } = await setup({ disabled: true });
    const clicked = vi.fn();
    component.clicked.subscribe(clicked);

    expect(button.disabled).toBe(true);

    button.click();

    expect(clicked).not.toHaveBeenCalled();
  });

  it('should apply the given type', async () => {
    const { button } = await setup({ type: 'submit', ariaLabel: 'Submit form' });

    expect(button.type).toBe('submit');
  });

  it('should stretch to full width when requested', async () => {
    const { fixture } = await setup({ fullWidth: true });

    expect(fixture.nativeElement.style.width).toBe('100%');
  });
});

interface Props {
  text: string;
  variant: ButtonVariant;
  outlined: boolean;
  fullWidth: boolean;
  type: ButtonType;
  disabled: boolean;
  ariaLabel?: string;
}
