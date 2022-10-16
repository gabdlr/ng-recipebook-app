import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];
    //  = [
    //     new Recipe('A test recipe',
    //     'Just a test',
    //     'https://static01.nyt.com/images/2021/02/17/dining/17tootired-sesame-noodles/merlin_126109679_c4abf7f2-e900-4552-a09a-a5421d4cbe8f-jumbo.jpg',
    //     [
    //         new Ingredient('Meat',2),
    //         new Ingredient('Carrot',7)
    //     ]),
    //     new Recipe('Another test recipe',
    //     'Just a simple test',
    //     'https://static01.nyt.com/images/2021/02/17/dining/17tootired-sesame-noodles/merlin_126109679_c4abf7f2-e900-4552-a09a-a5421d4cbe8f-jumbo.jpg',
    //     [
    //         new Ingredient('Pepperonni',4),
    //         new Ingredient('Pizza',6)
    //     ])
    // ];
    constructor(private shoppingListService: ShoppingListService){}

    getRecipes() {
        return [...this.recipes];
    }

    setRecipes(recipes: Recipe[]):void{
        this.recipes = recipes;
        this.recipesChanged.next([...recipes]);
    }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe):void{
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe):void{
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number):void{
        this.recipes.splice(index,1);
        this.recipesChanged.next([...this.recipes]);
    }
}