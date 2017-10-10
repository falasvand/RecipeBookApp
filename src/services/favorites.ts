import {Recipe} from '../models/recipe';
import {AuthService} from './auth';
import {Injectable} from '@angular/core';
import {AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class FavoritesService {

  favoriteListRef$: FirebaseListObservable<Recipe[]>;

  constructor(private authService: AuthService, private database: AngularFireDatabase) {
    if(authService.isAuthenticated()) {
      const userId = this.authService.getActiveUser().uid;
      this.favoriteListRef$ = this.database.list('favorite-list/' + `${userId}` + '/favorites');
    }
  }

  getFavorites() {
    return this.favoriteListRef$;
  }

  addToFavorites(recipe: Recipe) {
    this.favoriteListRef$.push(recipe);
  }

  deleteFavorite(recipe: Recipe) {
    this.favoriteListRef$.remove(recipe.$key);
  }

}
