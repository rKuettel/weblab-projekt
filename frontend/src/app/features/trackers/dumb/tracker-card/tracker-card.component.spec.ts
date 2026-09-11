import { Component, inputBinding, signal } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { Tracker } from '../../tracker.types';
import { TrackerCardComponent } from './tracker-card.component';
import { makeCounterTracker } from '../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { TrackerSummaryComponent } from '../tracker-summary/tracker-summary.component';

@Component({ template: 'stub' })
class DetailPageStub {}

const tracker = makeCounterTracker({ id: '1', name: 'Steps', summary: { sum: 100 } });

describe('TrackerCard', () => {
  async function setup(overrides: Partial<Tracker> = {}) {
    const mergedTracker = { ...tracker, ...overrides };

    await TestBed.configureTestingModule({
      imports: [TrackerCardComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        provideRouter([{ path: 'tracker/:id', component: DetailPageStub }]),
      ],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {
      tracker: { view: 'View' },
      event: { add: 'Add Event' },
    });

    const fixture = TestBed.createComponent(TrackerCardComponent, {
      bindings: [inputBinding('tracker', signal(mergedTracker))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      router: TestBed.inject(Router),
      buttons: fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    };
  }

  it('should render the tracker name and summary', async () => {
    const { fixture } = await setup({ name: 'Steps', summary: { sum: 100 } });

    expect(fixture.nativeElement.querySelector('h3')?.textContent).toBe('Steps');

    const summaryComponent = fixture.debugElement.query(By.directive(TrackerSummaryComponent))
      .componentInstance as TrackerSummaryComponent;
    expect(summaryComponent).toBeDefined();
  });

  it('should render view and add event buttons', async () => {
    const { buttons } = await setup();

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('View');
    expect(buttons[1].textContent?.trim()).toBe('Add Event');
  });

  it('should navigate to the tracker page when view is clicked', async () => {
    const { router, buttons } = await setup();

    await router.navigateByUrl('/');
    buttons[0].click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.url).toBe('/tracker/1');
  });

  it('should emit the tracker id when add event is clicked', async () => {
    const { component, buttons } = await setup({ id: '42' });
    const onAddEventClick = vi.fn();
    component.onAddEventClick.subscribe(onAddEventClick);

    buttons[1].click();

    expect(onAddEventClick).toHaveBeenCalledOnce();
    expect(onAddEventClick).toHaveBeenCalledWith('42');
  });
});
