import { Route } from '@angular/router';
import { PATHS } from './paths.config';
import { TrackerDashboardComponent } from '../features/trackers/smart/tracker-dashboard/tracker-dashboard.component';

const { HOME } = PATHS;

export const routes: Route[] = [
  {
    path: HOME.path,
    component: TrackerDashboardComponent,
  },
  {
    path: '**',
    redirectTo: HOME.path,
  },
];
