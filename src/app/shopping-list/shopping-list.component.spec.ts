import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShoppingListComponent } from "./shopping-list.component";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("shopping list", () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let storeSpy: jasmine.SpyObj<Store>;
  let INGREDIENT_STATE_MOCK: {ingredients: Ingredient[],editedIngredientIndex: number,editedIngredient: null|Ingredient};
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    TestBed.configureTestingModule({
      declarations: [ShoppingListComponent],
      providers: [{ provide: Store, useValue: storeSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    INGREDIENT_STATE_MOCK = {
      ingredients: [
        new Ingredient("Apples", 5),
        new Ingredient("Tomatoes", 10),
      ],
      editedIngredientIndex: -1,
      editedIngredient: null,
    };
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should assign to component ingredients property the data retrived from the store", () => {
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const firstIngredient: HTMLAnchorElement = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(firstIngredient.textContent).toContain(INGREDIENT_STATE_MOCK.ingredients[0].name);
  });

  it("should call dispatch when an ingredient item is clicked", () => {
    storeSpy.select.and.returnValue(of(INGREDIENT_STATE_MOCK));
    fixture.detectChanges();
    const firstIngredientDebugEl = fixture.debugElement.query(By.css('a'));
    firstIngredientDebugEl.triggerEventHandler('click', null);
    expect(storeSpy.dispatch).toHaveBeenCalled();
  })

});
