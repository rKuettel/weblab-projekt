import { TestBed } from '@angular/core/testing';
import { TrackerApi } from './tracker.api';

describe('TrackerApi', () => {
  let service: TrackerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
