import {Component, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  
  private user_id: string;
  
  constructor(public af: AngularFire, private router: Router) {
    const self = this;
    af.auth.subscribe(auth => {
      if (!auth) {
        console.log("User is not Logged In: ");
        this.router.navigate(['/login'])
      } else {
        self.user_id = auth.uid;
      }
    });
  }

  ngOnInit() {
  }

}
