import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  styles: `
    :host {
      display: inline-block;
      width: 100%;
    }
    button {
      width: 100%;
      /* padding: 0; */
      margin: 0;
    }
  `,
  template: `
    <button
      [type]="type()"
      [class]="styleClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      (click)="clicked.emit()"
    >
      {{ text() }}
    </button>
  `,
})
export class ButtonComponent {
  readonly text = input.required<string>();
  readonly variant = input<ButtonVariant>('primary');
  readonly outlined = input<boolean>(false);
  readonly outlinedClass = computed(() => (this.outlined() ? 'outlined' : ''));
  readonly styleClasses = computed(() => `${this.variant()}  ${this.outlined() ? 'outlined' : ''}`);

  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();
}
