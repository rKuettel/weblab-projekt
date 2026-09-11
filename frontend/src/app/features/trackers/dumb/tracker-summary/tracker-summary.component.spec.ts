import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TrackerSummaryComponent } from './tracker-summary.component';
import { makeCategoryTracker, makeCounterTracker } from '../../../../../../test/test-utils';
import { Tracker } from '../../tracker.types';
import { By } from '@angular/platform-browser';
import { BigNumberComponent } from '../../../../components/big-number/big-number.component';
import { PieChartComponent } from '../../../../components/charts/pie-chart/pie-chart.component';

describe('TrackerSummary', () => {
  async function setup(tracker: Tracker) {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TrackerSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrackerSummaryComponent, {
      bindings: [inputBinding('tracker', signal(tracker))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      summarySpan: fixture.nativeElement.querySelector('span.summary') as HTMLSpanElement,
    };
  }

  it('should render big number when counter tracker', async () => {
    const { fixture } = await setup(makeCounterTracker({ summary: { sum: 10 } }));

    const bigNumber = fixture.debugElement.query(By.directive(BigNumberComponent));
    expect(bigNumber).toBeDefined();
    const bigNumberComponent = bigNumber.componentInstance as BigNumberComponent;
    expect(bigNumberComponent.number()).toBe(10);
  });

  it('should render pie chart stats when category tracker', async () => {
    const { fixture } = await setup(
      makeCategoryTracker({ summary: [{ category: 'test', amount: 10 }] }),
    );

    const pieChart = fixture.debugElement.query(By.directive(PieChartComponent));

    expect(pieChart).toBeDefined();
  });
});
