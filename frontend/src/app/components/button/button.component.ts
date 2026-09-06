import { Component, computed, HostBinding, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  styles: `
    :host {
      display: inline-block;
      width: fit-content;
    }
    button {
      margin: 0;
    }
    .full-width {
      width: 100%;
    }
  `,
  template: `
    <button
      [type]="type()"
      [class.full-width]="fullWidth()"
      [class.outline]="outlined()"
      [class]="variant()"
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
  readonly fullWidth = input<boolean>(false);

  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();

  @HostBinding('style.width')
  get width() {
    return this.fullWidth() ? '100%' : 'fit-content';
  }
}
