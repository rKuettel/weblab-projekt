import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'test-dialog-host',
  imports: [DialogComponent],
  template: `
    <app-dialog [title]="title" [open]="open" (onClose)="closeCount = closeCount + 1">
      <p class="body">Projected content</p>
    </app-dialog>
  `,
})
class DialogHostComponent {
  title = 'My Dialog';
  open = false;
  closeCount = 0;
}

describe('Dialog', () => {
  async function setup(props: Partial<Omit<DialogHostComponent, 'closeCount'>> = {}) {
    const { title, open } = { title: 'My Dialog', open: false, ...props };

    await TestBed.configureTestingModule({
      imports: [DialogHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogHostComponent);
    const host = fixture.componentInstance;
    host.title = title;
    host.open = open;
    fixture.detectChanges();

    return {
      fixture,
      host,
      dialog: fixture.nativeElement.querySelector('dialog') as HTMLDialogElement,
    };
  }

  it('should render the title and projected content, closed by default', async () => {
    const { dialog } = await setup();

    expect(dialog.open).toBe(false);
    expect(dialog.querySelector('h3')?.textContent).toBe('My Dialog');
    expect(dialog.querySelector('.body')?.textContent).toContain('Projected content');
  });

  it('should emit onClose when the close button is clicked', async () => {
    const { host, dialog } = await setup({ open: true });

    const button = dialog.querySelector('header button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Close');

    button.click();

    expect(host.closeCount).toBe(1);
  });

  it('should emit onClose when the dialog closes', async () => {
    const { host, dialog } = await setup({ open: true });

    dialog.dispatchEvent(new Event('close'));

    expect(host.closeCount).toBe(1);
  });
});
