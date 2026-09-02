import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  template: `
    <nav>
      @for (linkItem of links(); track linkItem.path) {
        <a [routerLink]="linkItem.path" routerLinkActive="active">{{ linkItem.translationId | translate }}</a>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 1;
      display: block;
      border-bottom: 1px solid #e2e1e8;
      background: #fff;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: .25rem;
      width: min(100% - 2rem, 1200px);
      margin: 0 auto;
      padding: .75rem 0;
    }

    a {
      padding: .625rem .75rem;
      border-radius: 8px;
      text-decoration: none;
      color: #4e4c56;
    }

    a.active {
      color: #4f46a5;
      background: #eeecf9;
    }

    @media (max-width: 600px) {
      nav {
        width: min(100% - 1rem, 1200px);
      }
    }
  `
})
export class Navigation {

  links = input.required<NavigationItem[]>()

}
