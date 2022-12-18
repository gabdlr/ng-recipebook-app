import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from './../../store/app.reducer';
import * as RecipesActions from './../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
    )
  }

  private initForm():void{
    let recipeName: string = '';
    let recipeImagePath: string = '';
    let recipeDescription: string = '';
    let recipeIngredients: FormArray = new FormArray([]);

    if(this.editMode){
      this.storeSub = this.store.select('recipes')
      .pipe(
        map( state => state.recipes.find( (recipe,index) => index === this.id ))
      )
      .subscribe({
        next: recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if(recipe.ingredients){
            for(let ingredient of recipe.ingredients){
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name,Validators.required),
                  'amount': new FormControl(ingredient.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
                })
              );
            }
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    })
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit():void{
    if(this.editMode){
      this.store.dispatch(new RecipesActions.UpdateRecipe({
        index:this.id,
        newRecipe:this.recipeForm.value
      }));
    }else{
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onAddIngredient():void{
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name':new FormControl(null,Validators.required),
        'amount': new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onCancel():void{
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onDeleteIngredient(index: number):void{
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy(){
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
}


