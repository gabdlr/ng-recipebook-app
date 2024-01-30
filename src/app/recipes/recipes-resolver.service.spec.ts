import { TestBed } from "@angular/core/testing";
import { RecipesResolverService } from "./recipes-resolver.service";
import { Store } from "@ngrx/store";
import { Actions } from "@ngrx/effects";
import { Recipe } from "./recipe.model";
import { Observable, of } from "rxjs";
import { FetchRecipes } from "./store/recipe.actions";

describe("RecipesResolverService", () => {
  let service: RecipesResolverService;
  let storeSpy: jasmine.SpyObj<Store>;
  let actionsSpy: jasmine.SpyObj<Actions>;
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    actionsSpy = jasmine.createSpyObj("Actions", ["pipe"]);
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Actions, useValue: actionsSpy },
      ],
    });
    service = TestBed.inject(RecipesResolverService);
  });

  it("should return recipes in state", () => {
    const STATE_MOCK = {
      recipes: [new Recipe("mock", "mock", "mock", [])],
    };
    storeSpy.select.and.returnValue(of(STATE_MOCK));
    const response = <Observable<Recipe[]>>service.resolve();
    response.subscribe((recipes) => {
      expect(recipes).toEqual(STATE_MOCK.recipes);
    });
  });

  it("should fetch recipes if there are no recipes in the state", () => {
    const STATE_MOCK = {
      recipes: [],
    };
    storeSpy.select.and.returnValue(of(STATE_MOCK));
    actionsSpy.pipe.and.returnValue(of([]));
    (<Observable<Recipe[]>>service.resolve()).subscribe(() => {
      expect(storeSpy.dispatch).toHaveBeenCalledOnceWith(new FetchRecipes());
      expect(actionsSpy.pipe).toHaveBeenCalled();
    });
  });
});
