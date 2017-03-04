import {Component, OnInit} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';
@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

    constructor(public af: AngularFire, private router: Router) {
    }

    ngOnInit() {
    }

    logIn(formData) {
        if (formData.valid) {
            this.af.auth.login({
                    email: formData.value.email,
                    password: formData.value.password
                },
                {
                    provider: AuthProviders.Password,
                    method: AuthMethods.Password,
                }).then(
                (success) => {
                    console.log("success");
                    this.router.navigate(['/pricelist'])
                }).catch(
                (err) => {
                    console.log("Error");
                })
        }
    }

    goToSignUp() {
        this.router.navigate(['/signup'])
    }

}
