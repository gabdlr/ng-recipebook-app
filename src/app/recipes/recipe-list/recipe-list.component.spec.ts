import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecipeListComponent } from "./recipe-list.component";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { Recipe } from "../recipe.model";
import { Ingredient } from "../../shared/ingredient.model";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("recipe list component", () => {
  let fixture: ComponentFixture<RecipeListComponent>;
  let component: RecipeListComponent;
  let storeSpy: jasmine.SpyObj<Store>;
  let RECIPE_MOCK: Recipe;
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["select"]);
    TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      providers: [{ provide: Store, useValue: storeSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    RECIPE_MOCK = new Recipe('mock', 'mock', 'mock', [new Ingredient('mock',1)]);
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch recipes OnInit", () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    fixture.detectChanges();
    expect(component.recipes[0]).toEqual(RECIPE_MOCK);
  });
});
