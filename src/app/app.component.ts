import {Component} from "@angular/core";
import {DailyCropService} from "./daily-crop.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DailyCropService]
})

export class AppComponent {
  title = 'AgriPrice';
  loggedIn = false;

  ngOnInit() {
    console.log("AppComponent started");
    this.loggedIn = false;
  }
}
