import { Route } from '@angular/router';
import { PATHS } from './paths.config';
import { TrackerDashboardComponent } from '../features/trackers/smart/tracker-dashboard/tracker-dashboard.component';
import { TrackerDetailComponent } from '../features/trackers/smart/tracker-detail/tracker-detail.component';

const { HOME } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: TrackerDashboardComponent,
  },
  {
    path: 'tracker/:id',
    component: TrackerDetailComponent,
  },
  {
    path: '**',
    redirectTo: HOME.path,
  },
];
