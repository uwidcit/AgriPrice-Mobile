//Firebase Configuration
import {environment} from "../environments/environment";
// import * as firebase from 'firebase';
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {DailyCropService} from "./daily-crop.service";
import {MaterialModule} from "@angular/material";
import {routes} from "./app.router";
import {AppComponent} from "./app.component";
import {AngularFireModule} from "angularfire2";
import "hammerjs";
import {LoginComponent} from "./login/login.component";
import {AboutComponent} from "./about/about.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {PricelistComponent} from "./pricelist/pricelist.component";
import {TitleCasePipe} from "./pipes/title-case.pipe";
import {AccountComponent} from "./account/account.component";
import {CropComponent} from "./crop/crop.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    NotificationsComponent,
    PricelistComponent,
    TitleCasePipe,
	  AccountComponent,
	  CropComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase), //https://github.com/angular/angular-cli/wiki/stories-include-angularfire
    MaterialModule
  ],
  providers: [DailyCropService],
  bootstrap: [AppComponent]
})
export class AppModule { }
