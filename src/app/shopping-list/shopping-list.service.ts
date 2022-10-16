import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients(){
        return this.ingredients.slice();
    }

    getIngredient(index: number): Ingredient{
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next([...this.ingredients]);
    }

    addIngredients(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next([...this.ingredients]);
    }

    updateIngredient(index: number, newIngredient: Ingredient,){
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next([...this.ingredients]);
    }

    deleteIngredient(index: number): void{
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next([...this.ingredients]);
    }
}