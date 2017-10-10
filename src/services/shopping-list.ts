import {Ingredient} from '../models/Ingredient';

export class ShoppingListService {

  private ingredientList: Ingredient[] = [];

  getItems() {
    return this.ingredientList.slice();
  }

  addItem(name: string, amount: number) {
    this.ingredientList.push(new Ingredient(name, amount));
  }

  addItems(items: Ingredient[]) {
    this.ingredientList.push(...items);
  }

  removeItem(index: number) {
    this.ingredientList.splice(index, 1);
  }

  editItem(index: number, item: Ingredient) {
    this.ingredientList[index] = item;
  }
}
