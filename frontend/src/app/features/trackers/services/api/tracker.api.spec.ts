import { TestBed } from '@angular/core/testing';
import { TrakerApi } from './traker.api';

describe('TrakerApi', () => {
  let service: TrakerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrakerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
