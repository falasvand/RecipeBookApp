import { Component } from '@angular/core';
import {NavParams, NavController, ToastController} from "ionic-angular";
import {Recipe} from "../../models/Recipe";
import {EditRecipePage} from "../edit-recipe/edit-recipe";
import {ShoppingListService} from '../../services/shopping-list';
import {Ingredient} from '../../models/Ingredient';
import {RecipeService} from "../../services/recipe";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage {

  private recipe: Recipe;

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private shoppingListService: ShoppingListService,
              private toastCtrl: ToastController,
              private recipeService: RecipeService,
              private authService: AuthService) {
    this.recipe = this.navParams.get('recipe');
  }

  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {
      mode: 'Edit',
      recipeItemId: this.recipe.$key,
      recipe: this.recipe});
  }

  onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addItems(ingredients);
    const toast = this.toastCtrl.create({
      message: 'Items added to shopping list!',
      duration: 1500
    })
    toast.present();
  }

  onDeleteRecipe(recipe: Recipe) {
    const toast = this.toastCtrl.create({
      message: 'Recipe deleted successfully',
      duration: 1500
    });
    this.recipeService.deleteRecipe(recipe);
    toast.present();
    this.navCtrl.pop();
  }

  onLogout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
