/**
 * @vitest-environment jsdom
 */
import { vi } from 'vitest';
import { EchartsDarkTheme, EchartsLightTheme, ThemeService } from './theme.service';
import { describe, expect, it } from 'vitest';

describe('ThemeService', () => {
  const STORAGE_KEY = 'track-thing-theme';
  let matchMediaSpy: ReturnType<typeof vi.spyOn>;

  function mockSystemPreference(dark: boolean) {
    matchMediaSpy.mockImplementation(
      () =>
        ({
          matches: dark,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
  }

  beforeEach(() => {
    localStorage.clear();
    matchMediaSpy = vi.spyOn(window, 'matchMedia');
    mockSystemPreference(false);
  });

  afterEach(() => {
    matchMediaSpy.mockRestore();
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
  });

  it('should default to the light theme when no preference is stored', () => {
    const service = new ThemeService();

    expect(service.picoCssTheme()).toBe('light');
    expect(service.echartsTheme()).toBe(EchartsLightTheme);
  });

  it('should apply the pico theme to the html element', () => {
    new ThemeService();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should follow the system dark mode preference', () => {
    mockSystemPreference(true);
    const service = new ThemeService();

    expect(service.picoCssTheme()).toBe('dark');
  });

  it('should prefer the stored theme over the system preference', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    const darkService = new ThemeService();
    expect(darkService.picoCssTheme()).toBe('dark');

    localStorage.setItem(STORAGE_KEY, 'light');
    const lightService = new ThemeService();
    expect(lightService.picoCssTheme()).toBe('light');
  });

  it('should switch to dark and persist the choice', () => {
    const service = new ThemeService();

    service.toggle();

    expect(service.picoCssTheme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(service.echartsTheme()).toBe(EchartsDarkTheme);
  });

  it('should switch back to light and persist the choice', () => {
    const service = new ThemeService();
    service.toggle();
    service.toggle();

    expect(service.picoCssTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(service.echartsTheme()).toBe(EchartsLightTheme);
  });
});
