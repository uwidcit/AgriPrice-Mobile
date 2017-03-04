import {Component, OnInit} from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';
import {Router} from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    constructor(public af: AngularFire, private router: Router) {
    }

    ngOnInit() {
    }

    signUp(formData) {
        if (formData.valid) {
            this.af.auth.createUser({
                email: formData.value.email,
                password: formData.value.password
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

}
