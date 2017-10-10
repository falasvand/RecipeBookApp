import { Component, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/Ingredient";
import {AlertController, NavController} from "ionic-angular";
import {SigninPage} from "../signin/signin";
import {AuthService} from "../../services/auth";

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  shoppingListItems: Ingredient[] = [];
  @ViewChild('f') itemForm : NgForm;

  constructor(private shoppingListService: ShoppingListService,
              private alertCtrl: AlertController,
              private authService: AuthService,
              private navCtrl: NavController) {}

  ionViewWillEnter() {
    this.loadShoppingList();
  }

  onAddItem(form: NgForm) {
    this.shoppingListService.addItem(form.value.ingredientName, form.value.ingredientAmount);
    form.reset();
    this.loadShoppingList();
  }

  onRemoveItem(index: number) {
    this.shoppingListService.removeItem(index);
    this.loadShoppingList();
  }

  onEditItem(index: number, item: Ingredient) {
    const prompt = this.alertCtrl.create({
      title: 'Edit Item',
      inputs: [
        {
          name: 'itemName',
          type: 'string',
          value: item.name
        },
        {
          name: 'itemAmount',
          type: 'number',
          value: (item.amount).toString()
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            prompt.dismiss();
            return false;
          }
        },
        {
          text: 'Update',
          handler: data => {
            this.shoppingListService.editItem(index, new Ingredient(data.itemName, +data.itemAmount));
            this.loadShoppingList();
          }
        }
      ]
    });

    prompt.present();
  }

  private loadShoppingList() {
    this.shoppingListItems = this.shoppingListService.getItems();
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

}
