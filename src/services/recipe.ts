import {Recipe} from '../models/recipe';
import {Ingredient} from '../models/Ingredient';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

@Injectable()
export class RecipeService {

  recipeListRef$: FirebaseListObservable<Recipe[]>;

  constructor(private database: AngularFireDatabase) {
    this.recipeListRef$ = this.database.list('recipe-list');
  }

  addRecipe(title: string, directions: string, difficulty: string, imageUrl: string, creator: string,ingredients: Ingredient[]) {
    this.recipeListRef$.push({
      title: title,
      directions: directions,
      difficulty: difficulty,
      imageUrl: imageUrl,
      creator: creator,
      ingredients: ingredients
    });
  }

  deleteRecipe(recipe: Recipe) {
    this.recipeListRef$.remove(recipe.$key);
  }
  
}
