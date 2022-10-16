import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;
  public editMode: boolean;
  public editItemIndex: number;
  public editedItem: Ingredient;
  @ViewChild('f',{static:false}) slForm: NgForm;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this._subscription = this.shoppingListService.startedEditing
    .subscribe({
      next: (index: number) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    });
  }

  onSubmit(form: NgForm):void{
    const value = form.value;
    const ingredient: Ingredient = new Ingredient(value.name,value.amount);
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editItemIndex,ingredient)
    }else{
      this.shoppingListService.addIngredient(ingredient);
    }
    form.form.reset();
    this.editMode = false;
  }

  onClear():void{
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete():void{
    this.onClear();
    this.shoppingListService.deleteIngredient(this.editItemIndex);
  }

  ngOnDestroy():void{
    this._subscription.unsubscribe();
  }
}
