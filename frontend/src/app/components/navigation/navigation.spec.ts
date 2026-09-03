import { TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';
import { NavigationItem } from './navigation.type';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

describe('Navigation', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    const { fixture } = await setup();
    const title = fixture.nativeElement.querySelector('[data-testid="title"]');
    expect(title.textContent).toBe('Title');
  });
});

const defaultProps: Props = {
  links: [
    {
      path: 'Home',
      translationId: 'app.home',
    },
  ],
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [Navigation, RouterLink, RouterLinkActive],
    providers: [
      provideTranslateService({ fallbackLang: 'en' }),
      { provide: ActivatedRoute, useValue: {} },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Navigation, {
    bindings: [inputBinding('links', signal(mergedProps.links))],
  });
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', {
    app: { name: 'Title' },
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    fixture,
    component,
  };
}

interface Props {
  links: NavigationItem[];
}
