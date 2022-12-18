import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from './../../store/app.reducer'
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('recipes')
    .pipe(
      map(recipeState => recipeState.recipes)
    )
    .subscribe({
      next: (recipes: Recipe[]) => this.recipes = recipes
    }); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
