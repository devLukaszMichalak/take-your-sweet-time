import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRouts } from './pages';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';

const routes: Routes = [
  {path: PageRouts.LOGIN, component: LoginComponent},
  {path: PageRouts.DASHBOARD, component: DashboardComponent},
  {path: '**', redirectTo: PageRouts.LOGIN, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
