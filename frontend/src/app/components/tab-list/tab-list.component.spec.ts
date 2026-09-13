import { inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { TabListComponent, TabEntry } from './tab-list.component';

describe('TabListComponent', () => {
  let fixture: ComponentFixture<TabListComponent>;

  const tabs: TabEntry[] = [
    { value: 'overview', translationId: 'tab.overview' },
    { value: 'settings', translationId: 'tab.settings' },
  ];

  async function setup(props: Partial<Props> = {}) {
    const mergedProps: Props = {
      tabs,
      selectedTab: undefined,
      ...props,
    };

    await TestBed.configureTestingModule({
      imports: [TabListComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {
      tab: { overview: 'Overview', settings: 'Settings' },
    });

    fixture = TestBed.createComponent(TabListComponent, {
      bindings: [
        inputBinding('tabs', signal(mergedProps.tabs)),
        inputBinding('selectedTab', signal(mergedProps.selectedTab)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      tabElements: fixture.nativeElement.querySelectorAll('.tab') as NodeListOf<HTMLDivElement>,
    };
  }

  afterEach(() => {
    fixture?.destroy();
  });

  it('should render one tab per entry with the translated label', async () => {
    const { tabElements } = await setup();

    expect(tabElements.length).toBe(2);
    expect(tabElements[0].textContent?.trim()).toBe('Overview');
    expect(tabElements[1].textContent?.trim()).toBe('Settings');
  });

  it('should mark the tab matching selectedTab as selected', async () => {
    const { tabElements } = await setup({ selectedTab: 'settings' });

    expect(tabElements[0].classList).not.toContain('selected-tab');
    expect(tabElements[1].classList).toContain('selected-tab');
  });

  it('should not mark any tab as selected when selectedTab is not set', async () => {
    const { tabElements } = await setup();

    tabElements.forEach((tab) => expect(tab.classList).not.toContain('selected-tab'));
  });

  it('should emit the tab value when a tab is clicked', async () => {
    const { component, tabElements } = await setup({ selectedTab: 'overview' });
    const onTabChanged = vi.fn();
    component.tabChanged.subscribe(onTabChanged);

    tabElements[1].click();

    expect(onTabChanged).toHaveBeenCalledOnce();
    expect(onTabChanged).toHaveBeenCalledWith('settings');
  });
});

interface Props {
  tabs: TabEntry[];
  selectedTab?: string;
}
