import { Route } from '@angular/router';
import { TrackerDashboardComponent } from '../features/trackers/smart/tracker-dashboard/tracker-dashboard.component';
import { TrackerDetailComponent } from '../features/trackers/smart/tracker-detail/tracker-detail.component';

export const routes: Route[] = [
  {
    path: '',
    component: TrackerDashboardComponent,
  },
  {
    path: 'tracker/:id',
    component: TrackerDetailComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
