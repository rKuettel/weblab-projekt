import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let component: ThemeSwitcherComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;

    document.documentElement.dataset['theme'] = 'light';

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    document.documentElement.dataset['theme'] = 'light';
  });

  it('should render the light theme by default', () => {
    expect(component.isDark()).toBe(false);

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('☀️');
  });

  it('should switch to dark theme', () => {
    component.toggleTheme();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(component.isDark()).toBe(true);

    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('🌙');
  });

  it('should switch back to light theme', () => {
    component.toggleTheme();
    component.toggleTheme();

    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(component.isDark()).toBe(false);

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('☀️');
  });

  it('should toggle the theme when clicked', () => {
    const button: HTMLInputElement = fixture.nativeElement.querySelector('input');

    button.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('dark');

    button.click();
    fixture.detectChanges();

    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
