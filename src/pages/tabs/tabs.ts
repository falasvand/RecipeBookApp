import { Component } from '@angular/core';
import {ShoppingListPage} from "../shopping-list/shopping-list";
import {RecipesPage} from "../recipes/recipes";
import {FavoritesPage} from "../favorites/favorites";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  slPage = ShoppingListPage;
  recPage = RecipesPage;
  favsPage = FavoritesPage;
}
