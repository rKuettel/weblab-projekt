import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialog', () => {
  async function setup(props: Partial<Pick<ConfirmDialogComponent, 'open'>> = {}) {
    const { open } = { open: true, ...props };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {
      button: { confirm: 'Confirm' },
    });

    const fixture = TestBed.createComponent(ConfirmDialogComponent, {
      bindings: [
        inputBinding('open', signal(open)),
        inputBinding('title', signal('Delete tracker')),
        inputBinding('text', signal('Are you sure you want to delete this Tracker?')),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      dialog: fixture.debugElement.query(By.directive(DialogComponent))
        .componentInstance as DialogComponent,
      confirmButton: fixture.debugElement.query(By.directive(ButtonComponent))
        .componentInstance as ButtonComponent,
    };
  }

  it('should render the title and text in an open dialog', async () => {
    const { fixture, dialog } = await setup();

    expect(dialog.open()).toBe(true);
    expect(dialog.title()).toBe('Delete tracker');
    expect(fixture.nativeElement.textContent).toContain(
      'Are you sure you want to delete this Tracker?',
    );
  });

  it('should emit confirmed when the confirm button is clicked', async () => {
    const { component, confirmButton } = await setup();
    const onConfirmed = vi.fn();
    component.confirmed.subscribe(onConfirmed);

    expect(confirmButton.text()).toBe('Confirm');

    confirmButton.clicked.emit();
    expect(onConfirmed).toHaveBeenCalledOnce();
  });
});
