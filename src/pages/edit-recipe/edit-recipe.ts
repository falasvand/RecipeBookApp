import { Component } from '@angular/core';
import {ActionSheetController, NavParams, AlertController, ToastController, NavController} from "ionic-angular";
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from "../../services/recipe";
import {Recipe} from "../../models/recipe";
import {AuthService} from "../../services/auth";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage {

  mode: string = 'New';
  difficultyOptions = ['Simple', 'Moderate', 'Difficult'];
  recipeForm: FormGroup;
  recipe: Recipe;
  recipeItemRef$: FirebaseObjectObservable<Recipe>;


  constructor(public navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private recipeService: RecipeService,
              private navCtrl: NavController,
              private authService: AuthService,
              private database: AngularFireDatabase) {

    const recipeId = this.navParams.get('recipeItemId');
    this.recipeItemRef$ = this.database.object(`recipe-list/${recipeId}`);

  }

  ionViewWillEnter() {
    this.mode = this.navParams.get('mode');
    this.recipe = this.navParams.get('recipe');
    if(this.mode == 'Edit') {
      this.recipeItemRef$.subscribe(
        recipeItem => {
          if(!recipeItem.title) {
            return;
          }else{
            this.recipe = recipeItem;
          }
        }
      );
    }
    this.initializeForm();
  }

  private initializeForm() {
    let title = null;
    let directions = null;
    let difficulty = 'Moderate';
    let imageUrl = 'http://blog.canvascorpbrands.com/wp-content/uploads/2016/04/nicolette-recipe-book-step-1.jpg';
    let ingredients = [];

    if(this.mode == 'Edit') {
      title = this.recipe.title;
      directions = this.recipe.directions;
      difficulty = this.recipe.difficulty;
      imageUrl = this.recipe.imageUrl;
      if(this.recipe.ingredients != null){
        for(let ingredient of this.recipe.ingredients){
          ingredients.push(new FormControl(ingredient.name, Validators.required));
        }
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'directions': new FormControl(directions, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'imageUrl': new FormControl(imageUrl, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  onSubmitRecipe() {
    const value = this.recipeForm.value;
    let ingredients = [];
    if(value.ingredients.length > 0) {
      ingredients = value.ingredients.map(
        name => {
          return {name: name, amount: 1};
        });
    }
    if(this.mode == 'Edit') {
      this.recipeItemRef$.update(value);
    }else {
      this.recipeService.addRecipe(value.title, value.directions, value.difficulty, value.imageUrl, ingredients)
    }

    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose action',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.addIngredientAlert().present();
          }
        },
        {
          text: 'Remove All Ingredients',
          role: 'destructive',
          handler: () => {
            const formArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const leng = formArray.length;
            if(leng > 0) {
              for(let i = leng - 1; i >= 0; i--) {
                formArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All ingredients were removed.',
                duration: 1500
              })
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private addIngredientAlert() {
    const addIngAlert = this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Ingredient Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if(data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'You cannot enter a blank name',
                duration: 1500
              })
              toast.present();
              return;
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name, Validators.required));
            const toast = this.toastCtrl.create({
              message: 'Item added!',
              duration: 1500
            })
            toast.present();
          }
        }
      ]
    });
    return addIngAlert;
  }

  onLogout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
