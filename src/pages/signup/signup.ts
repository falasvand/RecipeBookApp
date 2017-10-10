import { Component } from '@angular/core';
import {AuthService} from '../../services/auth';
import {NavController, AlertController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {SigninPage} from "../signin/signin";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private alertCtrl: AlertController) {}

  onRegister(form: NgForm) {
    this.authService.signup(form.value.email, form.value.password)
      .then(
        value => {
          const alert = this.alertCtrl.create({
            title: 'Registration Successful',
            message: 'Registration was successful',
            buttons: ['Ok']
          });
          alert.present();
          this.navCtrl.setRoot(SigninPage);
        })
      .catch(
        error => {
          const alert = this.alertCtrl.create({
            title: 'Registration Failed',
            message: error.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
          form.reset();
          alert.present();
        });
  }

}
