import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PATHS } from './config/paths.config';

@Component({
  imports: [RouterOutlet, NavigationComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  template: `
    <header>
      <app-navigation appName="app.title" [links]="getAvailableLinks()"></app-navigation>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {
  private translate = inject(TranslateService);
  constructor() {
    this.translate.addLangs(['en']);
  }

  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
