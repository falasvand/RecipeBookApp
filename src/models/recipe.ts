import {Ingredient} from './Ingredient';

export class Recipe{
  constructor(public title: string,
              public directions: string,
              public difficulty: string,
              public imageUrl: string,
              public creator: string,
              public ingredients?: Ingredient[],
              public $key?: string) {}
}
