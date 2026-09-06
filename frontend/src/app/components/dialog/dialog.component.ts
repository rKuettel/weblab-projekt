import { Component, HostBinding, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-dialog',
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
    <dialog closedby="closerequest" (close)="onClose.emit()" [open]="open()">
      <article>
        <header>
          <button aria-label="Close" rel="prev" (click)="onClose.emit()"></button>
          <h3>{{ title() }}</h3>
        </header>
        <ng-content></ng-content>
      </article>
    </dialog>
  `,
})
export class DialogComponent {
  title = input.required<string>();
  open = input(false);
  onClose = output<void>();
}
