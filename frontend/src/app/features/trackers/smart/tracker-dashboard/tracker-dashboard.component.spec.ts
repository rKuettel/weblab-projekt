import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerDashboardComponent } from './tracker-dashboard.component';

describe('TrackerDashboard', () => {
  let component: TrackerDashboardComponent;
  let fixture: ComponentFixture<TrackerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
