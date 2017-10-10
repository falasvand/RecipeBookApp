import { Component } from '@angular/core';
import {AuthService} from "../../services/auth";
import {SigninPage} from "../signin/signin";
import {NavController, ToastController} from "ionic-angular";
import {Recipe} from '../../models/recipe';
import {FavoritesService} from "../../services/favorites";
import {FirebaseListObservable, AngularFireDatabase} from "angularfire2/database";
import {RecipePage} from '../recipe/recipe';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

  favoriteListRef$: FirebaseListObservable<Recipe[]>;

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private favoritesService: FavoritesService,
              private toastCtrl: ToastController,
              private database: AngularFireDatabase) {
    if(authService.isAuthenticated()) {
      const userId = this.authService.getActiveUser().uid;
      this.favoriteListRef$ = this.database.list('favorite-list/' + `${userId}` + '/favorites');
    }
  }

  onLogin() {
    this.navCtrl.push(SigninPage);
  }

  onLogout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  onSelectFavorite(recipe: Recipe) {
    this.navCtrl.push(RecipePage, {
      recipe: recipe
    });
  }

  onRemoveFromFavorites(recipe: Recipe) {
    const toast = this.toastCtrl.create({
      message: 'Recipe was removed from Favorites',
      duration: 1500
    });

    this.favoritesService.deleteFavorite(recipe);
    toast.present();
  }
}
