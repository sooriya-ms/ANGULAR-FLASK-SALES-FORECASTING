import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { IntroComponent } from './intro/intro.component';

const routes: Routes = [{
  path: '', component: IntroComponent
}, {
  path: 'login', component: LoginComponent
}, {
  path: 'dashboard', component: DashboardComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
