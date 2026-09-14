import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface TabEntry {
  value: string;
  translationId: string;
}

@Component({
  imports: [TranslatePipe],
  selector: 'app-tab-list',
  styles: `
    .tab-list {
      display: flex;
    }
    .tab {
      padding: 0.1rem 0.5rem;
      cursor: pointer;
      border-bottom: 2px solid var(--pico-muted-border-color);
    }
    .selected-tab {
      border-bottom: 2px solid var(--pico-primary);
    }
  `,
  template: `
    <div class="tab-list">
      @for (tab of tabs(); track $index) {
        <div
          class="tab"
          [class.selected-tab]="tab.value === selectedTab()"
          [attr.data-testid]="'tab-' + tab.value"
          (click)="changeTab(tab)"
        >
          {{ tab.translationId | translate }}
        </div>
      }
    </div>
  `,
})
export class TabListComponent {
  readonly tabs = input.required<TabEntry[]>();
  readonly selectedTab = input<string>();
  readonly tabChanged = output<string>();

  changeTab(tab: TabEntry) {
    this.tabChanged.emit(tab.value);
  }
}
