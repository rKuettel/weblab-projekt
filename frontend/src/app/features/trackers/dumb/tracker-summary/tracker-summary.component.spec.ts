import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TrackerSummaryComponent } from './tracker-summary.component';

describe('TrackerSummary', () => {
  async function setup(summary: number) {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TrackerSummaryComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrackerSummaryComponent, {
      bindings: [inputBinding('summary', signal(summary))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      summarySpan: fixture.nativeElement.querySelector('span.summary') as HTMLSpanElement,
    };
  }

  it('should render the summary value', async () => {
    const { summarySpan } = await setup(42);

    expect(summarySpan.textContent?.trim()).toBe('42');
  });

  it('should apply the computed font size to the summary', async () => {
    const { component, summarySpan } = await setup(42);

    expect(summarySpan.style.fontSize).toBe(component.fontSize());
  });

  it('caps the font size at 50cqw for short numbers', async () => {
    for (const summary of [0, 7, 42, 123]) {
      const { component } = await setup(summary);
      expect(parseFloat(component.fontSize())).toBe(50);
    }
  });

  it('scales the font size down for long numbers', async () => {
    for (const [summary, expected] of [
      [1234, 100 / 4 / 0.6],
      [12345, 100 / 5 / 0.6],
    ] as const) {
      const { component } = await setup(summary);
      expect(parseFloat(component.fontSize())).toBeCloseTo(expected);
      expect(component.fontSize().endsWith('cqw')).toBe(true);
    }
  });
});
