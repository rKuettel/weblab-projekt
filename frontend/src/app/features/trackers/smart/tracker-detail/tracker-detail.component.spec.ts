import { computed, signal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackerDetailComponent } from './tracker-detail.component';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi, EventsQueryParams } from '../../services/api/event.api';
import { TrackerEvent } from '../../events.types';
import { makeEvent, makeTracker } from '../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import { DateRangeSelectorComponent } from '../../../../components/date-range-selector/date-range-selector.component';

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
  };
}

describe('TrackerDetail', () => {
  async function setup(apiEvents: TrackerEvent[] = events) {
    const getTrackerSpy = vi.fn();
    const getTrackerEventsSpy = vi.fn();

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
        {
          provide: TrackerApi,
          useValue: {
            getTracker: getTrackerSpy.mockReturnValue({
              value: signal(makeTracker({ id: '42', name: 'Steps', summary: 30 })),
              isLoading: signal(false),
              error: signal(undefined),
            }),
          },
        },
        {
          provide: EventApi,
          useValue: {
            getTrackerEvents: getTrackerEventsSpy.mockImplementation(() =>
              makeEventsResource(apiEvents),
            ),
          },
        },
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {});

    const fixture = TestBed.createComponent(TrackerDetailComponent);
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      root: fixture.nativeElement as Element,
      getTrackerSpy,
      getTrackerEventsSpy,
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

  it('should group events per day for the heatmap', async () => {
    const { component } = await setup([
      makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
      makeEvent({ id: 'e2', timestamp: new Date('2024-06-11T15:30:00Z'), data: { delta: 20 } }),
      makeEvent({ id: 'e3', timestamp: new Date('2024-06-11T18:00:00Z'), data: { delta: 5 } }),
    ]);

    expect(component.heatMapData()).toEqual([
      { date: new Date('2024-06-10'), value: 10 },
      { date: new Date('2024-06-11'), value: 25 },
    ]);
  });

  it('should map events to bar chart data', async () => {
    const { component } = await setup();

    const barData = component.barChartData();
    expect(barData.map((d) => d.value)).toEqual([20, 10]);
    barData.forEach((d) => expect(d.name).toBeTruthy());
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
