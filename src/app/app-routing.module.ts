import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = 
[
  { path: '', component: HomeComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
