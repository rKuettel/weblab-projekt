import { TestBed } from '@angular/core/testing';
import { CategoryTrackerStatsComponent } from './category-tracker-stats.component';
import { TrackerEvent } from '../../events.types';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';
import { CategoryTrackerSummary } from '../../tracker.types';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';
const DEFAULT_RANGE: DateRange = {
  from: new Date('2024-01-01'),
  to: new Date('2024-01-31'),
};

describe('CategoryTrackerStatsComponent', () => {
  async function setup(
    events: TrackerEvent[] = [],
    dateRange: DateRange = DEFAULT_RANGE,
    trackerSummary: CategoryTrackerSummary = [{ category: 'test', amount: 30 }],
  ) {
    await TestBed.configureTestingModule({
      imports: [CategoryTrackerStatsComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {});

    const fixture = TestBed.createComponent(CategoryTrackerStatsComponent, {
      bindings: [
        inputBinding('dateRange', signal(dateRange)),
        inputBinding('trackerSummary', signal(trackerSummary)),
        inputBinding('trackerEvents', signal(events)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });
});
