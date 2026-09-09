import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventApi } from './event.api';
import { Tracker } from '../../tracker.types';
import { makeTracker } from '../../../../../../test/test-utils';

describe('EventApi', () => {
  let service: EventApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventApi, provideHttpClientTesting()],
    });
    service = TestBed.inject(EventApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getTrackerEvents', () => {
    it('should request events with the date range as query params and parse timestamps', async () => {
      const from = new Date('2024-01-01T00:00:00Z');
      const to = new Date('2024-01-31T00:00:00Z');
      const resource = TestBed.runInInjectionContext(() =>
        service.getTrackerEvents(signal('42'), signal({ from, to })),
      );

      TestBed.tick();

      const request = httpTesting.expectOne((req) => {
        const fromParam = req.params?.get('from') === from.toISOString();
        const toParam = req.params?.get('to') === to.toISOString();
        return req.url === 'api/tracker/42/event' && fromParam && toParam;
      });
      expect(request.request.method).toBe('GET');

      request.flush([
        { id: 'e1', timestamp: '2024-01-15T10:30:00Z', type: 'counter', data: { delta: 5 } },
      ]);
      await TestBed.inject(ApplicationRef).whenStable();

      expect(resource.hasValue()).toBe(true);
      expect(resource.isLoading()).toBe(false);
      expect(resource.value()?.[0]?.timestamp).toEqual(new Date('2024-01-15T10:30:00Z'));
      expect(resource.value()?.[0]?.data).toEqual({ delta: 5 });
    });

    it('should omit query params when the date range is empty', async () => {
      const resource = TestBed.runInInjectionContext(() =>
        service.getTrackerEvents(signal('42'), signal({})),
      );
      TestBed.tick();

      const request = httpTesting.expectOne((req) => {
        return (
          req.url === 'api/tracker/42/event' &&
          req.params?.get('from') === null &&
          req.params?.get('to') === null
        );
      });
      expect(request.request.method).toBe('GET');

      request.flush([]);
      await TestBed.inject(ApplicationRef).whenStable();

      expect(resource.value()).toEqual([]);
    });
  });

  describe('addEvent', () => {
    it('should post the event and emit the updated tracker', async () => {
      const tracker = makeTracker({ id: '42', summary: 55 });
      const event = {
        timestamp: new Date('2024-02-01T09:00:00Z'),
        type: 'counter',
        data: { delta: 5 },
      };

      const emitted: Tracker[] = [];
      service.addEvent('42', event).subscribe((t) => emitted.push(t));

      const request = httpTesting.expectOne(
        (req) => req.method === 'POST' && req.url === 'api/tracker/42/event',
      );
      expect(request.request.body).toEqual(event);

      request.flush(tracker);
      await TestBed.inject(ApplicationRef).whenStable();

      expect(emitted).toEqual([tracker]);
    });
  });
});
