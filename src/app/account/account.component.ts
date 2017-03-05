import {Component, OnInit} from "@angular/core";
import {AngularFire} from "angularfire2";
import {Router} from "@angular/router";

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
	
	private user_id: string;
	username = "Default User";
	email = "Default Email";
	profile_img = "assets/images/portrait_placeholder.png";
	account_type = "Google";
	
	constructor(public af: AngularFire, private router: Router) {
		const self = this;
		af.auth.subscribe(auth => {
			if (!auth) {
				console.log("User is not Logged In: ");
				this.router.navigate(['/login'])
			} else {
				self.user_id = auth.uid;
				self.username = auth.auth.displayName;
				self.email = auth.auth.email;
				console.dir(auth);
				if (auth.auth.photoURL && auth.auth.photoURL.length > 1) {
					self.profile_img = auth.auth.photoURL;
				}
			}
		});
	}
	
	ngOnInit() {
	}
	
	signOut() {
		
	}
	
	changeNotification() {
		this.router.navigate(['/notification'])
	}
}
