import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, ThemeSwitcherComponent],
  styles: `
    .title {
      cursor: pointer;
      margin-bottom: 0;
    }
  `,
  template: `
    <nav>
      <ul>
        <li>
          <h1 class="title" [routerLink]="['/']" data-testid="title" clicka>
            {{ title | translate }}
          </h1>
        </li>
      </ul>
      <ul>
        @for (linkItem of links(); track linkItem.path) {
          <li>
            <a [routerLink]="linkItem.path" routerLinkActive="active">
              {{ linkItem.translationId | translate }}
            </a>
          </li>
        }
        <li><app-theme-switcher /></li>
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class NavigationComponent {
  title = 'app.title';
  links = input.required<NavigationItem[]>();
}
