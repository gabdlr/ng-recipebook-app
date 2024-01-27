import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShoppingEditComponent } from "./shopping-edit.component";
import { Store } from "@ngrx/store";
import { FormsModule } from "@angular/forms";
import { Ingredient } from "../../shared/ingredient.model";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import * as ShoppingListActions from "./../store/shopping-list.actions";

describe("shopping edit component", () => {
  let component: ShoppingEditComponent;
  let fixture: ComponentFixture<ShoppingEditComponent>;
  let INGREDIENT_STATE_MOCK: {
    ingredients: Ingredient[];
    editedIngredientIndex: number;
    editedIngredient: null | Ingredient;
  };
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    TestBed.configureTestingModule({
      declarations: [ShoppingEditComponent],
      imports: [FormsModule],
      providers: [{ provide: Store, useValue: storeSpy }],
    });

    fixture = TestBed.createComponent(ShoppingEditComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should set editMode to true if there is editedIngredient is > -1 in data from store", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: 0,
      editedIngredient: new Ingredient("Apples", 5),
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
  });

  it("should set editMode to false if editedIngredient is >= -1 in data from store", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    expect(component.editMode).toBeFalse();
  });

  it("should set editMode to false if editedIngredient is >= -1 in data from store", async () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    expect(component.editMode).toBeFalse();
  });

  it("should call ShoppinglistActions.updateIngredient if is on edit mode", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: 0,
      editedIngredient: new Ingredient("Apples", 5),
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const submitButtonEl: HTMLButtonElement = fixture.debugElement.query(
      By.css("button")
    ).nativeElement;
    submitButtonEl.click();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should call ShoppinglistActions.updateIngredient if is not on edit mode", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const submitButtonEl: HTMLButtonElement = fixture.debugElement.query(
      By.css("button")
    ).nativeElement;
    submitButtonEl.click();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should do cleanup when clear button is clicked", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: 0,
      editedIngredient: new Ingredient("Apples", 5),
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const formSpy = spyOn(component.slForm, "reset");
    const clearButtonEl: HTMLButtonElement = fixture.debugElement.queryAll(
      By.css("button")
    )[2].nativeElement;
    clearButtonEl.click();
    expect(component.editMode).toBeFalse();
    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(formSpy).toHaveBeenCalled();
  });

  it("should call dispatch with delete ingredient action when delete button is called", () => {
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: 0,
      editedIngredient: new Ingredient("Apples", 5),
    };
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const deleteButtonEl: HTMLButtonElement = fixture.debugElement.queryAll(
      By.css("button")
    )[1].nativeElement;
    const clearSpy = spyOn(component, "onClear");
    deleteButtonEl.click();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      new ShoppingListActions.DeleteIngredient()
    );
    expect(clearSpy).toHaveBeenCalled();
  });
});
