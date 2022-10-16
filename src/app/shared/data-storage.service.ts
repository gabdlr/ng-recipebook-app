import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes():void {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put('https://ng-app2-fc463-default-rtdb.firebaseio.com/recipes.json',recipes)
    .subscribe();
  }

  fetchRecipes(){
    return this.httpClient.get<Recipe[]>('https://ng-app2-fc463-default-rtdb.firebaseio.com/recipes.json')
    .pipe(
      map( recipes => {
        return recipes.map( recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        })
      }),
      tap(recipes => this.recipeService.setRecipes(recipes))
    )  
  }

}
