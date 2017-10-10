import { Component } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {EditRecipePage} from '../edit-recipe/edit-recipe';
import {Recipe} from "../../models/Recipe";
import {RecipePage} from "../recipe/recipe";
import {SigninPage} from "../signin/signin";
import {AuthService} from "../../services/auth";
import {FavoritesService} from "../../services/favorites";
import {FirebaseListObservable, AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  recipeListRef$: FirebaseListObservable<Recipe[]>;
  favorites: Recipe[] = [];

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private favoritesService: FavoritesService,
              private toastCtrl: ToastController,
              private database: AngularFireDatabase) {
    this.recipeListRef$ = this.database.list('recipe-list');
  }

  ionViewCanEnter() {
    return new Promise(
      (resolve, reject) => {
        if(this.authService.isAuthenticated()) {
          this.favoritesService.getFavorites()
            .subscribe(
              favorites => {
                this.favorites = favorites;
                resolve(favorites);
              },
              error => {
                console.log('failed to get data', error);
                reject(error);
              }
            );
        }else{
          resolve(true);
        }
      })
      .catch(
        (error) => console.log(error)
      );
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe) {
    this.navCtrl.push(RecipePage, {
      recipe: recipe
    });
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

  onAddToFavorites(recipe: Recipe) {
    const toast = this.toastCtrl.create({
      message: 'Recipe was added to Favorites',
      duration: 1500
    });

    this.favoritesService.addToFavorites(recipe);
    toast.present();
  }

  onRemoveFromFavorites(recipe: Recipe) {
    const toast = this.toastCtrl.create({
      message: 'Recipe was removed from Favorites',
      duration: 1500
    });

    if(this.favorites){
      for(let x of this.favorites){
        if(x.title === recipe.title){
          this.favoritesService.deleteFavorite(x);
          toast.present();
        }
      }
    }
  }

  isExistingFavorite(recipe: Recipe) {
    for(let f of this.favorites){
      if(f.title === recipe.title){
        return true;
      }
    }
    return false;
  }

}
