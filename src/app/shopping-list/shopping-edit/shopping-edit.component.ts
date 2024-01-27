import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './../store/shopping-list.actions';
import * as fromApp from './../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;
  public editMode: boolean;
  public editedItem: Ingredient;
  @ViewChild('f',{static:false}) slForm: NgForm;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this._subscription = this.store.select('shoppingList').subscribe( stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }else{
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm):void{
    const value = form.value;
    const ingredient: Ingredient = new Ingredient(value.name,value.amount);
    if(this.editMode){
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient))
    }else{
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient))
    }
    form.form.reset();
    this.editMode = false;
  }

  onClear():void{
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete():void{
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy():void{
    if(this._subscription){
      this._subscription.unsubscribe();
    }
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
