import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeService } from '../../services/theme.service';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let fixture: ComponentFixture<ThemeSwitcherComponent>;
  let component: ThemeSwitcherComponent;
  let themeService: Pick<ThemeService, 'picoCssTheme' | 'toggle'>;

  function createThemeServiceMock(initialTheme: 'light' | 'dark' = 'light') {
    const theme = signal(initialTheme);

    return {
      picoCssTheme: computed(() => theme()),
      toggle: vi.fn(() => theme.update((current) => (current === 'light' ? 'dark' : 'light'))),
    };
  }

  beforeEach(async () => {
    themeService = createThemeServiceMock();

    await TestBed.configureTestingModule({
      imports: [ThemeSwitcherComponent],
      providers: [{ provide: ThemeService, useValue: themeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should render the light theme when the service is in light mode', () => {
    expect(component.isDark()).toBe(false);

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('☀️');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(false);
    expect(input.getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('should render the dark theme when the service is in dark mode', () => {
    themeService.toggle();
    fixture.detectChanges();

    expect(component.isDark()).toBe(true);

    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('🌙');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('should call the theme service toggle on toggleTheme()', () => {
    component.toggleTheme();

    expect(themeService.toggle).toHaveBeenCalledOnce();
  });

  it('should toggle the theme when clicked', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    input.click();
    fixture.detectChanges();

    expect(themeService.toggle).toHaveBeenCalledTimes(1);
    expect(component.isDark()).toBe(true);

    input.click();
    fixture.detectChanges();

    expect(themeService.toggle).toHaveBeenCalledTimes(2);
    expect(component.isDark()).toBe(false);
  });
});
