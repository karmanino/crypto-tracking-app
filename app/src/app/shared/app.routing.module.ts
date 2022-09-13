import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { P2PComponent } from '../components/p2p/p2p.component';
import { AlarmsComponent } from '../pages/alarms/alarms/alarms.component';
import { LoginComponent } from '../pages/login/login/login.component';

const routes: Routes = [
  { path: 'alarms', component: AlarmsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'crypto', component: DashboardComponent },
  { path: 'p2p', component: P2PComponent},
  { path: '**', component: P2PComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }