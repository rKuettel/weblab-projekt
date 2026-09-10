import { Component, computed, DOCUMENT, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  imports: [],
  selector: 'app-theme-switcher',
  styles: `
    div {
      justify-content: center;
    }
  `,
  template: `
    <div>
      <label>
        <input
          name="terms"
          type="checkbox"
          role="switch"
          (change)="toggleTheme()"
          [checked]="isDark()"
          [attr.aria-label]="isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
        />
        {{ isDark() ? '🌙' : '☀️' }}</label
      >
    </div>
  `,
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  readonly isDark = computed(() => this.themeService.picoCssTheme() === 'dark');

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
