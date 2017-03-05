import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AboutComponent} from "./about/about.component";
import {LoginComponent} from "./login/login.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {PricelistComponent} from "./pricelist/pricelist.component";
import {AccountComponent} from "./account/account.component";

export const router: Routes = [
  { path: '', redirectTo: 'pricelist', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'pricelist', component: PricelistComponent},
  {path: 'account', component: AccountComponent},
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
