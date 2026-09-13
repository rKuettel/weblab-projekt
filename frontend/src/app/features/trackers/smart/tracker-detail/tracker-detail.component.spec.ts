import { computed, signal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackerDetailComponent } from './tracker-detail.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi, EventsQueryParams } from '../../services/api/event.api';
import { TrackerEvent } from '../../events.types';
import { makeEvent, makeCounterTracker } from '../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import {
  DateRange,
  DateRangeSelectorComponent,
} from '../../../../components/date-range-selector/date-range-selector.component';
import { Tracker } from '../../tracker.types';
import { DialogComponent } from '../../../../components/dialog/dialog.component';
import { EventFormComponent } from '../../dumb/event-form/event-form.component';

const events: TrackerEvent[] = [
  makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
  makeEvent({ id: 'e2', timestamp: new Date('2024-06-11T15:30:00Z'), data: { delta: 20 } }),
];

function makeEventsResource(initialEvents: TrackerEvent[]) {
  const value = signal(initialEvents);
  return {
    value,
    isLoading: signal(false),
    error: signal(undefined),
    hasValue: computed(() => value() !== undefined),
    reload: vi.fn(),
  };
}

describe('TrackerDetail', () => {
  async function setup(
    tab = 'stats',
    dateRange: DateRange = { to: new Date(), from: new Date() },
    tracker: Tracker = makeCounterTracker({ id: '42', name: 'Steps', summary: { sum: 30 } }),
    apiEvents: TrackerEvent[] = events,
  ) {
    const getTrackerSpy = vi.fn();
    const getTrackerEventsSpy = vi.fn();
    const addEventSpy = vi.fn().mockReturnValue(of({}));
    const deleteEventSpy = vi.fn().mockReturnValue(of({}));
    const deleteTrackerSpy = vi.fn().mockReturnValue(of({}));
    const editTrackerSpy = vi.fn();
    const trackerSet = vi.fn();
    const navigateSpy = vi.fn();
    const eventsResource = makeEventsResource(apiEvents);

    await TestBed.configureTestingModule({
      imports: [TrackerDetailComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '42' },
            },
            params: of({ id: '42' }),
            queryParamMap: of(
              new Map(
                Object.entries({
                  tab: tab,
                  from: dateRange.from.toISOString(),
                  to: dateRange.to.toISOString(),
                }),
              ),
            ),
          },
        },
        { provide: Router, useValue: { navigate: navigateSpy } },
        {
          provide: TrackerApi,
          useValue: {
            getTracker: getTrackerSpy.mockReturnValue({
              value: signal(tracker),
              hasValue: signal(true),
              isLoading: signal(false),
              error: signal(undefined),
              set: trackerSet,
              reload: vi.fn(),
            }),
            deleteTracker: deleteTrackerSpy,
            editTracker: editTrackerSpy,
          },
        },
        {
          provide: EventApi,
          useValue: {
            getTrackerEvents: getTrackerEventsSpy.mockImplementation(() => eventsResource),
            deleteEvent: deleteEventSpy,
            addEvent: addEventSpy,
          },
        },
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {
      button: { confirm: 'Confirm' },
      tracker: {
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Confirm Deletion',
        confirmDeleteLong: 'Are you sure you want to delete this Tracker?',
      },
      event: {
        delete: 'Delete',
        confirmDelete: 'Confirm Deletion',
        confirmDeleteLong: 'Are you sure you want to delete this Event?',
      },
    });

    const fixture = TestBed.createComponent(TrackerDetailComponent);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      root: fixture.nativeElement as Element,
      getTrackerSpy,
      getTrackerEventsSpy,
      addEventSpy,
      deleteEventSpy,
      deleteTrackerSpy,
      editTrackerSpy,
      trackerSet,
      navigateSpy,
      eventsResource,
    };
  }

  it('should request the tracker and its events by the route id and date range (normailized to midnight)', async () => {
    const dateRange = {
      from: new Date(2026, 8, 8, 10, 12, 13),
      to: new Date(2026, 8, 9, 9, 8, 8),
    };

    const { getTrackerSpy, getTrackerEventsSpy } = await setup('stats', dateRange);

    expect(getTrackerSpy).toHaveBeenCalledOnce();
    expect((getTrackerSpy.mock.calls[0][0] as Signal<string>)()).toBe('42');

    expect(getTrackerEventsSpy).toHaveBeenCalledOnce();
    const [trackerId, usedDateRange] = getTrackerEventsSpy.mock.calls[0] as [
      Signal<string>,
      Signal<EventsQueryParams>,
    ];
    expect(trackerId()).toBe('42');

    const expectedDateRange = {
      from: new Date(2026, 8, 8),
      to: new Date(2026, 8, 9, 23, 59, 59),
    };
    expect(usedDateRange()).toEqual(expectedDateRange);
  });

  it('should hand events over to eventList', async () => {
    const { fixture } = await setup('events');

    const eventlist = fixture.debugElement.query(By.directive(EventListComponent))
      .componentInstance as EventListComponent | undefined;

    expect(eventlist?.events()).toHaveLength(events.length);
  });

  it('should delete an event after confirmation and reload the data', async () => {
    const { fixture, deleteEventSpy, eventsResource } = await setup('events');
    const eventListEl = fixture.debugElement.query(By.directive(EventListComponent))
      .componentInstance as EventListComponent;
    eventListEl.onDelete.emit('e2');

    expect(deleteEventSpy).toHaveBeenCalledOnce();
    expect(deleteEventSpy).toHaveBeenCalledWith('42', 'e2');
    expect(eventsResource.reload).toHaveBeenCalled();
  });

  it('should delete the tracker and navigate home after confirmation', async () => {
    const { fixture, deleteTrackerSpy, navigateSpy } = await setup();

    const [_edit, _addEvent, deleteButtonEl] = fixture.debugElement.queryAll(
      By.directive(ButtonComponent),
    );
    deleteButtonEl.componentInstance.clicked.emit();
    fixture.detectChanges();

    const [trackerConfirmDialog] = fixture.debugElement
      .queryAll(By.directive(ConfirmDialogComponent))
      .map((el) => el.componentInstance as ConfirmDialogComponent);
    expect(trackerConfirmDialog.open()).toBe(true);

    trackerConfirmDialog.confirmed.emit();
    fixture.detectChanges();

    expect(deleteTrackerSpy).toHaveBeenCalledOnce();
    expect(deleteTrackerSpy).toHaveBeenCalledWith('42');
    expect(navigateSpy).toHaveBeenCalledOnce();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  it('should call api and close the dialog when updating the tracker', async () => {
    const { fixture, component, editTrackerSpy, trackerSet } = await setup();

    const [edit] = fixture.debugElement.queryAll(By.directive(ButtonComponent));
    edit.componentInstance.clicked.emit();
    fixture.detectChanges();

    const trackerEditDialog = fixture.debugElement
      .queryAll(By.directive(DialogComponent))
      .find((e) => e.attributes['id'] === 'trackerEditDialog')
      ?.componentInstance as DialogComponent;
    expect(trackerEditDialog.open()).toBe(true);

    const form = fixture.debugElement.query(By.directive(TrackerFormComponent))
      .componentInstance as TrackerFormComponent;
    expect(form.tracker()).toEqual(
      makeCounterTracker({ id: '42', name: 'Steps', summary: { sum: 30 } }),
    );
    expect(form.typeDisabled()).toBe(true);

    const updated = makeCounterTracker({ id: '42', name: 'Renamed' });
    editTrackerSpy.mockReturnValue(of(updated));
    form.onFormSubmit.emit(updated);
    TestBed.tick();
    fixture.detectChanges();

    expect(editTrackerSpy).toHaveBeenCalledWith('42', { name: 'Renamed' });
    expect(trackerSet).toHaveBeenCalledWith(updated);
    expect(component.editDialogOpen()).toBe(false);
  });

  it('should call api and close the dialog when adding a event', async () => {
    const { fixture, component, addEventSpy, trackerSet } = await setup();

    const [_edit, addEvent] = fixture.debugElement.queryAll(By.directive(ButtonComponent));
    addEvent.componentInstance.clicked.emit();
    fixture.detectChanges();

    const trackerEditDialog = fixture.debugElement
      .queryAll(By.directive(DialogComponent))
      .find((e) => e.attributes['id'] === 'eventAddDialog')?.componentInstance as DialogComponent;
    expect(trackerEditDialog.open()).toBe(true);

    const form = fixture.debugElement.query(By.directive(EventFormComponent))
      .componentInstance as EventFormComponent;

    addEventSpy.mockReturnValue(of(makeCounterTracker({ summary: { sum: 100 } })));
    const updated = makeEvent({ timestamp: new Date() });
    form.onFormSubmit.emit(updated);

    expect(addEventSpy).toHaveBeenCalledWith('42', updated);
    expect(trackerSet).toHaveBeenCalled();
    expect(component.editDialogOpen()).toBe(false);
  });

  it('should update query params when the date range changed', async () => {
    const { fixture, navigateSpy } = await setup();

    const dateRangeComponent = fixture.debugElement.query(By.directive(DateRangeSelectorComponent))
      .componentInstance as DateRangeSelectorComponent | undefined;

    dateRangeComponent?.changed.emit({
      from: new Date(2026, 8, 8),
      to: new Date(2026, 8, 9, 9, 8, 7),
    });

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: {
        tab: 'stats',
        from: new Date(2026, 8, 8).toISOString(),
        to: new Date(2026, 8, 9, 9, 8, 7).toISOString(),
      },
    });
  });
});
