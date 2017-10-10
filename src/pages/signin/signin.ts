import { Component } from '@angular/core';
import {NavController, AlertController} from "ionic-angular";
import {SignupPage} from "../signup/signup";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth";
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private alertCtrl: AlertController) {}

  onLogin(form: NgForm) {
    this.authService.signin(form.value.email, form.value.password)
      .then(
        () => {
          console.log('Login successful!');
          this.navCtrl.push(TabsPage);
        }
      )
      .catch(
        error => {
          const alert = this.alertCtrl.create({
            title: 'Login Failed',
            message: error.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          form.reset();
          alert.present();
        }
      );
  }

  onNavigateToSignup() {
    this.navCtrl.push(SignupPage);
  }
}
