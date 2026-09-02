import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerDashboard } from './tracker-dashboard';

describe('TrackerDashboard', () => {
  let component: TrackerDashboard;
  let fixture: ComponentFixture<TrackerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
