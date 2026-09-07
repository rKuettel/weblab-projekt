import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerSummaryComponent } from './tracker-summary.component';

describe('TrackerSummaryComponent', () => {
  let component: TrackerSummaryComponent;
  let fixture: ComponentFixture<TrackerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
