import {Component, OnInit} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods} from "angularfire2";
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(public af: AngularFire, private router: Router) {
    af.auth.subscribe(auth => {
      if (auth) {
        console.log("User is Logged In: ");
        console.dir(auth);
        this.router.navigate(['/account'])
      }
    })
  }

  ngOnInit() {
  
  }
  
  
  onSucessAuth(user) {
    console.dir(user);
    this.router.navigate(['/pricelist'])
  }
  
  googleSignIn() {
    console.log("Google Sign-in Option Selected");
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Redirect,
    }).then(
        (success) => {
          console.log("Google Sign In Was successful");
          console.dir(success);
        }).catch(
        (err) => {
          console.error("Error in Google Sign-in proces: " + err);
        });
  }
  
  logIn(formData) {
    const self = this;
    if (formData.valid) {
      //TODO check if user was created before
      
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
            console.dir(success);
            self.onSucessAuth(success);
          }).catch(
          (err) => {
            console.log("Error");
          })
    }
  }
  
  signUp(formData) {
    const self = this;
    if (formData.valid) {
      this.af.auth.createUser({
        email: formData.value.email,
        password: formData.value.password
      }).then(
          (success) => {
            console.log("success");
            console.dir(success);
            self.onSucessAuth(success);
          }).catch(
          (err) => {
            console.error("Error in Google Sign-in proces: " + err);
          })
    } else {
      // Notify User that content is invalid
    }
  }

}
