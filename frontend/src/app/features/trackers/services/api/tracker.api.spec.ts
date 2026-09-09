import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TrackerApi } from './tracker.api';
import { CreateTracker, Tracker } from '../../tracker.types';
import { makeTracker } from '../../../../../../test/test-utils';

describe('TrackerApi', () => {
  let service: TrackerApi;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackerApi, provideHttpClientTesting()],
    });
    service = TestBed.inject(TrackerApi);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getTracker', () => {
    it('should request a single tracker by id', async () => {
      const resource = TestBed.runInInjectionContext(() => service.getTracker(signal('42')));
      TestBed.tick();

      const request = httpTesting.expectOne((req) => req.url === 'api/tracker/42');
      expect(request.request.method).toBe('GET');

      const tracker = makeTracker({ id: '42', name: 'Steps' });
      request.flush(tracker);
      await TestBed.inject(ApplicationRef).whenStable();

      expect(resource.value()).toEqual(tracker);
    });
  });

  describe('getTrackers', () => {
    it('should default to an empty list before the request resolves', async () => {
      const resource = TestBed.runInInjectionContext(() => service.getTrackers());
      TestBed.tick();

      expect(resource.hasValue()).toBe(true);
      expect(resource.value()).toEqual([]);

      const request = httpTesting.expectOne((req) => req.url === 'api/tracker');
      expect(request.request.method).toBe('GET');
      request.flush([makeTracker({ id: '1' }), makeTracker({ id: '2', name: 'Water' })]);
      await TestBed.inject(ApplicationRef).whenStable();
    });
  });

  describe('createTracker', () => {
    it('should post a new tracker and emit the created tracker', async () => {
      const newTracker: CreateTracker = { name: 'Steps', type: 'counter' };
      const created = makeTracker({ id: '7', name: 'Steps' });

      const emitted: Tracker[] = [];
      service.createTracker(newTracker).subscribe((t) => emitted.push(t));

      const request = httpTesting.expectOne(
        (req) => req.method === 'POST' && req.url === 'api/tracker',
      );
      expect(request.request.body).toEqual(newTracker);

      request.flush(created);
      await TestBed.inject(ApplicationRef).whenStable();

      expect(emitted).toEqual([created]);
    });
  });
});
