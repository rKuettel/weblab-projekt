import { Component, DOCUMENT, inject, signal } from '@angular/core';

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
          [value]="isDark()"
          [attr.aria-label]="isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
        />
        {{ isDark() ? '🌙' : '☀️' }}</label
      >
    </div>
  `,
})
export class ThemeSwitcherComponent {
  private readonly document = inject(DOCUMENT);

  readonly isDark = signal(this.document.documentElement.dataset['theme'] === 'dark');

  toggleTheme(): void {
    const element = this.document.documentElement;

    if (this.isDark()) {
      element.dataset['theme'] = 'light';
      this.isDark.set(false);
    } else {
      element.dataset['theme'] = 'dark';
      this.isDark.set(true);
    }
  }
}
