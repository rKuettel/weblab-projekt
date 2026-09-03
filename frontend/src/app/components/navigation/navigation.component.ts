import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, ThemeSwitcherComponent],
  template: `
    <nav>
      <ul>
        <li>
          <strong data-testid="title">{{ title | translate }}</strong>
        </li>
      </ul>
      <ul>
        @for (linkItem of links(); track linkItem.path) {
          <li>
            <button [routerLink]="linkItem.path" routerLinkActive="active">
              {{ linkItem.translationId | translate }}
            </button>
          </li>
        }
        <li><app-theme-switcher /></li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class NavigationComponent {
  title = 'app.title';
  links = input.required<NavigationItem[]>();
}
