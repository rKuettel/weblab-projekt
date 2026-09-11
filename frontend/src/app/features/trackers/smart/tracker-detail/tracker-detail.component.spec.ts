import { computed, signal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackerDetailComponent } from './tracker-detail.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi, EventsQueryParams } from '../../services/api/event.api';
import { TrackerEvent } from '../../events.types';
import {
  makeEvent,
  makeCounterTracker,
  makeCategoryTracker,
} from '../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { ButtonComponent } from '../../../../components/button/button.component';
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { DateRangeSelectorComponent } from '../../../../components/date-range-selector/date-range-selector.component';
import { Tracker } from '../../tracker.types';
import { CounterTrackerStatsComponent } from '../../dumb/counter-tracker-stats/counter-tracker-stats.component';
import { CategoryTrackerStatsComponent } from '../../dumb/category-tracker-stats/category-tracker-stats.component';

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
    tracker: Tracker = makeCounterTracker({ id: '42', name: 'Steps', summary: { sum: 30 } }),
    apiEvents: TrackerEvent[] = events,
  ) {
    const getTrackerSpy = vi.fn();
    const getTrackerEventsSpy = vi.fn();
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
            snapshot: { params: { id: '42' } },
            params: of({ id: '42' }),
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
      deleteEventSpy,
      deleteTrackerSpy,
      editTrackerSpy,
      trackerSet,
      navigateSpy,
      eventsResource,
    };
  }

  it('should request the tracker and its events by the route id', async () => {
    const { getTrackerSpy, getTrackerEventsSpy } = await setup();

    expect(getTrackerSpy).toHaveBeenCalledOnce();
    expect((getTrackerSpy.mock.calls[0][0] as Signal<string>)()).toBe('42');

    expect(getTrackerEventsSpy).toHaveBeenCalledOnce();
    const [trackerId, dateRange] = getTrackerEventsSpy.mock.calls[0] as [
      Signal<string>,
      Signal<EventsQueryParams>,
    ];
    expect(trackerId()).toBe('42');
    expect(dateRange().from).toBeInstanceOf(Date);
    expect(dateRange().to?.getTime()).toBeGreaterThan(dateRange().from?.getTime() ?? 0);
  });

  it('should hand events over to eventList', async () => {
    const { fixture } = await setup();

    const eventlist = fixture.debugElement.query(By.directive(EventListComponent))
      .componentInstance as EventListComponent | undefined;

    expect(eventlist?.events()).toHaveLength(events.length);
  });

  it('should only render counter stats when counter tracker', async () => {
    const { fixture } = await setup(makeCounterTracker({ summary: { sum: 10 } }));

    const counterTracker = fixture.debugElement.query(By.directive(CounterTrackerStatsComponent));
    const categoryTracker = fixture.debugElement.query(By.directive(CategoryTrackerStatsComponent));

    expect(counterTracker).toBeDefined();
    expect(categoryTracker).toBeNull();
  });

  it('should only render category stats when category tracker', async () => {
    const { fixture } = await setup(
      makeCategoryTracker({ summary: [{ category: 'test', amount: 10 }] }),
    );

    const counterTracker = fixture.debugElement.query(By.directive(CounterTrackerStatsComponent));
    const categoryTracker = fixture.debugElement.query(By.directive(CategoryTrackerStatsComponent));

    expect(counterTracker).toBeNull();
    expect(categoryTracker).toBeDefined();
  });

  it('should delete an event after confirmation and reload the data', async () => {
    const { fixture, deleteEventSpy, eventsResource } = await setup();

    const eventListEl = fixture.debugElement.query(By.directive(EventListComponent))
      .componentInstance as EventListComponent;
    eventListEl.onDelete.emit('e2');

    expect(deleteEventSpy).toHaveBeenCalledOnce();
    expect(deleteEventSpy).toHaveBeenCalledWith('42', 'e2');
    expect(eventsResource.reload).toHaveBeenCalled();
  });

  it('should delete the tracker and navigate home after confirmation', async () => {
    const { fixture, deleteTrackerSpy, navigateSpy } = await setup();

    const [_, deleteButtonEl] = fixture.debugElement.queryAll(By.directive(ButtonComponent));
    deleteButtonEl.componentInstance.clicked.emit();
    fixture.detectChanges();

    const [eventConfirmDialog, trackerConfirmDialog] = fixture.debugElement
      .queryAll(By.directive(ConfirmDialogComponent))
      .map((el) => el.componentInstance as ConfirmDialogComponent);
    expect(eventConfirmDialog.open()).toBe(false);
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

    const form = fixture.debugElement.query(By.directive(TrackerFormComponent))
      .componentInstance as TrackerFormComponent;
    expect(form.tracker()).toEqual(
      makeCounterTracker({ id: '42', name: 'Steps', summary: { sum: 30 } }),
    );
    expect(form.typeDisabled()).toBe(true);

    const updated = makeCounterTracker({ id: '42', name: 'Renamed' });
    form.onFormSubmit.emit(updated);
    editTrackerSpy.mockReturnValue(of(updated));

    component.updateTracker({ name: 'Renamed', type: 'counter' });

    expect(editTrackerSpy).toHaveBeenCalledWith('42', { name: 'Renamed' });
    expect(trackerSet).toHaveBeenCalledWith(updated);
    expect(component.editDialogOpen()).toBe(false);
  });

  it('should update the date range passed to the event API when the range changes', async () => {
    const { fixture, getTrackerEventsSpy } = await setup();

    const dateRangeComponent = fixture.debugElement.query(By.directive(DateRangeSelectorComponent))
      .componentInstance as DateRangeSelectorComponent | undefined;

    dateRangeComponent?.changed.emit({
      from: new Date(2026, 8, 8, 10, 12, 13),
      to: new Date(2026, 8, 9, 9, 8, 7),
    });
    const [, dateRange] = getTrackerEventsSpy.mock.calls[0] as [
      Signal<string>,
      Signal<EventsQueryParams>,
    ];

    expect(dateRange().from).toStrictEqual(new Date(2026, 8, 8));
    expect(dateRange().to).toStrictEqual(new Date(2026, 8, 9, 23, 59, 59));
  });
});
