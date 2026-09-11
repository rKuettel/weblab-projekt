import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { TrackerEvent } from '../../events.types';
import { EventListComponent } from './event-list.component';
import { makeEvent } from '../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

describe('EventList', () => {
  const events: TrackerEvent[] = [
    makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
    makeEvent({ id: 'e2', timestamp: new Date('2024-06-12T10:00:00Z'), data: { delta: 20 } }),
    makeEvent({ id: 'e3', timestamp: new Date('2024-06-11T10:00:00Z'), data: { delta: 30 } }),
  ];

  async function setup(list: TrackerEvent[] = events) {
    await TestBed.configureTestingModule({
      imports: [EventListComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {
      event: {
        delete: 'Delete',
        confirmDelete: 'Confirm Deletion',
        confirmDeleteLong: 'Are you sure you want to delete this Event?',
      },
      button: { confirm: 'Confirm' },
    });

    const fixture = TestBed.createComponent(EventListComponent, {
      bindings: [inputBinding('events', signal(list))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      eventBlocks: fixture.nativeElement.querySelectorAll('.event') as HTMLDivElement[],
    };
  }

  it('should render all events', async () => {
    const { eventBlocks } = await setup();
    expect(eventBlocks.length).toBe(3);
  });

  it('should only delete the event after the confirmation dialog is confirmed', async () => {
    const { fixture, component } = await setup();
    const onDelete = vi.fn();
    component.onDelete.subscribe(onDelete);

    const deleteButton = fixture.debugElement.queryAll(By.directive(ButtonComponent))[0]
      .componentInstance as ButtonComponent;
    deleteButton.clicked.emit();
    fixture.detectChanges();

    expect(onDelete).not.toHaveBeenCalled();

    const confirmDialog = fixture.debugElement.query(By.directive(ConfirmDialogComponent))
      .componentInstance as ConfirmDialogComponent;
    expect(confirmDialog.open()).toBe(true);

    confirmDialog.confirmed.emit();
    fixture.detectChanges();

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith('e2');
    expect(confirmDialog.open()).toBe(false);
  });
});
