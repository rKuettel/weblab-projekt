import { Component, input, output } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ButtonComponent } from '../button/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [DialogComponent, ButtonComponent, TranslatePipe],
  selector: 'app-confirm-dialog',
  styles: ``,
  template: `
    <app-dialog [open]="this.open()" [title]="this.title()" (onClose)="onClose.emit()">
      <p>{{ text() }}</p>
      <app-button [text]="'button.confirm' | translate" (clicked)="confirmed.emit()"></app-button>
    </app-dialog>
  `,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly confirmed = output();
  readonly onClose = output();
}
