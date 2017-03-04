import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DailyCropService } from './daily-crop.service';
import { MaterialModule } from '@angular/material';
import { routes } from './app.router';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import 'hammerjs';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PricelistComponent } from './pricelist/pricelist.component';

export const firebaseConfig = {
  apiKey: "AIzaSyB8LxFyLM1grQ66E6mqXVYevdlZO2jV_HI",
  authDomain: "agriprice-6638d.firebaseapp.com",
  databaseURL: "https://agriprice-6638d.firebaseio.com",
  storageBucket: "agriprice-6638d.appspot.com",
  messagingSenderId: "164306272558"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    NotificationsComponent,
    PricelistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule
  ],
  providers: [DailyCropService],
  bootstrap: [AppComponent]
})
export class AppModule { }
