import { Route } from '@angular/router';
import { PATHS } from './paths.config';
import { TrackerDashboard } from '../features/trackers/smart/tracker-dashboard/tracker-dashboard';

const { HOME } = PATHS;


export const routes: Route[] = [
  {
    path: HOME.path,
    component: TrackerDashboard
  },
  {
    path: '**',
    redirectTo: HOME.path
  }
]
