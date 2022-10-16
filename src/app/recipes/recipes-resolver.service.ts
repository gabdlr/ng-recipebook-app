import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn:'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private dataStorageServe: DataStorageService,
                private recipeService: RecipeService){}
    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
        const recipes = this.recipeService.getRecipes();
        if(recipes.length === 0){
            return this.dataStorageServe.fetchRecipes();
        }
        return recipes;
    }

}