import { computed, DOCUMENT, inject, Service, signal } from '@angular/core';
import type { ThemeOption } from 'ngx-echarts';

@Service()
export class ThemeService {
  private readonly STORAGE_KEY = 'track-thing-theme';
  private readonly isDark = signal(this.loadTheme());
  private rootAttribute = 'data-theme';

  readonly echartsTheme = computed(() => (this.isDark() ? EchartsDarkTheme : EchartsLightTheme));
  readonly picoCssTheme = computed(() => (this.isDark() ? 'dark' : 'light'));

  constructor() {
    this.applyPicoCssTheme();
  }

  public toggle(): void {
    const dark = !this.isDark();
    this.isDark.set(dark);
    this.applyPicoCssTheme();
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
  }

  private loadTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return stored === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyPicoCssTheme(): void {
    document.querySelector('html')?.setAttribute(this.rootAttribute, this.picoCssTheme());
  }
}

const colors = [
  '#017fc0', // PicoCSS Primary
  '#525f7a', // PicoCSS Secondary
  '#d1e5fb',
  '#01aaff',
  '#015887',
];

const gradientColor = [
  '#d1e5fb',
  '#017fc0', // PicoCSS Primary
  '#525f7a', // PicoCSS Secondary
];

export const EchartsLightTheme: ThemeOption = {
  color: colors,
  gradientColor: gradientColor,
};

export const EchartsDarkTheme: ThemeOption = {
  backgroundColor: 'transparent',
  color: colors,
  gradientColor: gradientColor,
  textStyle: {
    color: '#c2c7d0', // --pico-color (zinc-200)
  },
  legend: {
    textStyle: { color: '#c2c7d0' }, // --pico-color
    pageTextStyle: { color: '#c2c7d0' }, // --pico-color
  },
  tooltip: {
    backgroundColor: '#181c25', // --pico-card-background-color (slate-900)
    borderColor: '#202632', // --pico-muted-border-color (slate-850)
    borderWidth: 1,
    textStyle: { color: '#c2c7d0' }, // --pico-color
  },
  calendar: {
    itemStyle: { color: 'transparent', borderColor: '#202632' }, // --pico-muted-border-color
    splitLine: { lineStyle: { color: '#202632' } }, // --pico-muted-border-color
    dayLabel: { color: '#c2c7d0' }, // --pico-color
    monthLabel: { color: '#c2c7d0' }, // --pico-color
    yearLabel: { color: '#c2c7d0' }, // --pico-color
  },
  visualMap: {
    textStyle: { color: '#c2c7d0' }, // --pico-color
  },
};
