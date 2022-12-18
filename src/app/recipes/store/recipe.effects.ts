import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, tap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromApp from './../../store/app.reducer';

@Injectable()
export class RecipesEffects {
    constructor(private actions$: Actions,
                private httpClient: HttpClient,
                private store: Store<fromApp.AppState>){}

    fetchRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => this.httpClient.get<Recipe[]>('https://ng-app2-fc463-default-rtdb.firebaseio.com/recipes.json')),
            map( recipes => {
                return recipes.map( recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                })
            }),
            map( recipes => new RecipesActions.SetRecipes(recipes))
        )
    })

    storeRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            tap(()=>console.log('hola')),
            switchMap( ([actionData, recipesState]) => {
                return this.httpClient.put('https://ng-app2-fc463-default-rtdb.firebaseio.com/recipes.json',recipesState.recipes)
            })
        )
    },{dispatch:false})
}