import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <nav>
      <ul>
        <li>
          <strong>{{ this.appName() | translate }}</strong>
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
      </ul>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class Navigation {
  appName = input.required<string>();
  links = input.required<NavigationItem[]>();
}
