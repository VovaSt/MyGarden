import { Routes } from '@angular/router';
import { GardenListComponent } from './features/gardens/garden-list.component';
import { HarvestCalendarComponent } from './features/harvest-calendar/harvest-calendar.component';

export const routes: Routes = [
  { path: 'gardens', component: GardenListComponent },
  { path: 'harvest-calendar', component: HarvestCalendarComponent },
  { path: '', pathMatch: 'full', redirectTo: 'gardens' },
  { path: '**', redirectTo: 'gardens' },
];
