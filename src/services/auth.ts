import {AngularFireAuth} from 'angularfire2/auth';
import {Injectable} from "@angular/core";
import {SigninPage} from "../pages/signin/signin";
import {App} from "ionic-angular";

@Injectable()
export class AuthService {

  token: string;
  currentUserState: boolean;

  constructor(private afAuth: AngularFireAuth, private app: App) {
    afAuth.authState.subscribe(
      data => {
        if(data) {
          this.currentUserState = true;
        }else{
          this.currentUserState = false;
        }
      }
    );
  }

  signup(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(
        () => this.app.getRootNav().setRoot(SigninPage)
      );
  }

  getActiveUser() {
    return this.afAuth.auth.currentUser;
  }

  getToken() {
    this.afAuth.auth.currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  isAuthenticated() {
    return this.currentUserState;
  }

}
