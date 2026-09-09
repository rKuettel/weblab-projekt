import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TrackerDashboardComponent } from './tracker-dashboard.component';
import { Tracker, TRACKER_TYPES } from '../../tracker.types';
import { makeTracker } from '../../../../../../test/test-utils';
import { provideHttpClient } from '@angular/common/http';
import { TrackerApi } from '../../services/api/tracker.api';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../../../../components/button/button.component';
import { TrackerCardComponent } from '../../dumb/tracker-card/tracker-card.component';
import { TrackerFormComponent } from '../../dumb/tracker-form/tracker-form.component';
import { of } from 'rxjs';
import { EventApi } from '../../services/api/event.api';
import { EventFormComponent } from '../../dumb/event-form/event-form.component';
import { CreateTrackerEvent } from '../../events.types';

const translations = {
  tracker: {
    add: 'Add Tracker',
  },
};

const trackers = [
  makeTracker({ id: '1', name: 'Steps', summary: 100 }),
  makeTracker({ id: '2', name: 'Water', summary: 50 }),
];

describe('TrackerDashboard', () => {
  async function setup(initialTrackers: Tracker[] = trackers) {
    const getTrackersSpy = vi.fn();
    const createTrackerSpy = vi.fn();
    const addEventSpy = vi.fn();
    const trackersSignal = signal(initialTrackers);

    await TestBed.configureTestingModule({
      imports: [TrackerDashboardComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        provideHttpClient(),
        {
          provide: TrackerApi,
          useValue: {
            getTrackers: getTrackersSpy.mockReturnValue({
              value: trackersSignal,
              isLoading: signal(false),
              error: signal(undefined),
              update: function (updater: (trackers: Tracker[]) => Tracker[]) {
                trackersSignal.update(updater);
              },
            }),
            createTracker: createTrackerSpy,
          },
        },
        {
          provide: EventApi,
          useValue: {
            addEvent: addEventSpy,
          },
        },
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', translations);

    const fixture = TestBed.createComponent(TrackerDashboardComponent);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      getTrackersSpy,
      createTrackerSpy,
      addEventSpy,
    };
  }

  it('should render a card for each tracker', async () => {
    const { fixture } = await setup();

    const cards = fixture.nativeElement.querySelectorAll('app-tracker-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('h3')?.textContent).toBe('Steps');
    expect(cards[1].querySelector('h3')?.textContent).toBe('Water');
    expect(cards[0].querySelector('app-tracker-summary')?.textContent).toContain('100');
  });

  it('should render no cards when there are no trackers', async () => {
    const { fixture } = await setup([]);

    expect(fixture.nativeElement.querySelectorAll('app-tracker-card')).toHaveLength(0);
  });

  it('should open the add tracker dialog when the add button is clicked', async () => {
    const { fixture } = await setup();

    const addBtn = fixture.debugElement
      .queryAll(By.directive(ButtonComponent))
      .find((btn) => btn.attributes['data-testid'] === 'add-tracker-btn')?.componentInstance as
      ButtonComponent | undefined;
    addBtn?.clicked.emit();

    fixture.detectChanges();

    const dialogs = fixture.nativeElement.querySelectorAll('dialog');
    expect(dialogs).toHaveLength(2);
    expect(dialogs[0].open).toBe(true);
    expect(dialogs[0].querySelector('h3')?.textContent).toBe('Add Tracker');
    expect(dialogs[1].open).toBe(false);
  });

  it('should create a tracker from the dialog form', async () => {
    const { fixture, createTrackerSpy } = await setup();
    const initialCount = fixture.componentInstance.trackers.value().length;
    const trackerForm = fixture.debugElement.query(By.directive(TrackerFormComponent))
      .componentInstance as TrackerFormComponent | undefined;

    const trackerToAdd = {
      name: 'Test Tracker',
      type: TRACKER_TYPES.counter,
    };

    createTrackerSpy.mockReturnValue(
      of({
        id: 'test-id',
        summary: 10,
        ...trackerToAdd,
      }),
    );

    trackerForm?.onFormSubmit.emit({ ...trackerToAdd });

    expect(createTrackerSpy).toHaveBeenCalledExactlyOnceWith(trackerToAdd);

    expect(fixture.componentInstance.trackers.value()).toHaveLength(initialCount + 1);
  });

  it('should open the add event dialog with the tracker name when add event is clicked', async () => {
    const { fixture } = await setup();

    const card = fixture.debugElement.query(By.directive(TrackerCardComponent))
      .componentInstance as TrackerCardComponent;
    card?.onAddEventClick.emit(card.tracker().id);
    fixture.detectChanges();

    const dialogs = fixture.nativeElement.querySelectorAll('dialog');
    expect(dialogs[0].open).toBe(false);
    expect(dialogs[1].open).toBe(true);
  });

  it('should add an event and update the tracker', async () => {
    const { fixture, addEventSpy } = await setup();
    const eventForm = fixture.debugElement.query(By.directive(EventFormComponent))
      .componentInstance as EventFormComponent;

    fixture.componentInstance.currentTracker.set({
      id: 'test-id',
      name: 'Test',
      type: TRACKER_TYPES.counter,
      summary: 0,
    });
    const eventToAdd: CreateTrackerEvent = {
      type: TRACKER_TYPES.counter,
      timestamp: new Date(),
      data: {
        delta: 10,
      },
    };

    addEventSpy.mockReturnValue(of({}));

    eventForm?.onFormSubmit.emit({ ...eventToAdd });

    expect(addEventSpy).toHaveBeenCalledExactlyOnceWith('test-id', eventToAdd);
  });
});
