import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecipeDetailComponent } from "./recipe-detail.component";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "./../../store/app.reducer";
import { Recipe } from "../recipe.model";
import { By } from "@angular/platform-browser";

describe("recipe-detail component", () => {
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let component: RecipeDetailComponent;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<Store<fromApp.AppState>>;
  let RECIPE_MOCK: Recipe & {id: number};
  
  beforeEach(() => {
    RECIPE_MOCK = {
      id: 1,
      name: "test name",
      description: "test description",
      imagePath: "test image path",
      ingredients: [],
    };
  
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
    activatedRouteSpy.params = of({ id: "0" });
  
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storeSpy = jasmine.createSpyObj('Store', ['select','dispatch']);
    storeSpy.select.and.returnValue(of({recipes: [RECIPE_MOCK]}));
  
    TestBed.configureTestingModule({
      declarations: [RecipeDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
  });

  it("should fetch recipe according to activiatedRoute param id", () => {
    fixture.detectChanges();
    expect(component.recipe.name).toBe(RECIPE_MOCK.name);
  });

  it("should call dispatch when 'To shopping list button' is clicked", () => {
    fixture.debugElement.query(By.css('.btn-group')).triggerEventHandler('click',null);
    const addToShoppingListButton = fixture.debugElement.query(By.css('.dropdown-menu'))
      .queryAll(By.css('li'))[0]
      .query(By.css('a'));
    addToShoppingListButton.triggerEventHandler('click', null);
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should call dispatch when 'Delete recipe' button is clicked", () => {
    fixture.debugElement.query(By.css('.btn-group')).triggerEventHandler('click',null);
    const addToShoppingListButton = fixture.debugElement.query(By.css('.dropdown-menu'))
      .queryAll(By.css('li'))[2]
      .query(By.css('a'));
    addToShoppingListButton.triggerEventHandler('click', null);
    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/recipes']);
  });

});
