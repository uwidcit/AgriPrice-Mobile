import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import {EmailComponent} from './email/email.component';
import {SignupComponent} from './signup/signup.component';

export const router: Routes = [
  { path: '', redirectTo: 'pricelist', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', component: NotificationsComponent },
    {path: 'pricelist', component: PricelistComponent},
    {path: 'email', component: EmailComponent},
    {path: 'signup', component: SignupComponent}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
