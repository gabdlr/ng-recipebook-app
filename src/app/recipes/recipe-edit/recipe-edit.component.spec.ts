import { ComponentFixture, TestBed } from "@angular/core/testing"
import { RecipeEditComponent } from "./recipe-edit.component"
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import * as fromApp from "./../../store/app.reducer";
import { of } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { Ingredient } from "../../shared/ingredient.model";
import { Recipe } from "../recipe.model";
import { By } from "@angular/platform-browser";
import { FormArrayName } from "@angular/forms";

describe("recipe edit component", () => {
  let fixture: ComponentFixture<RecipeEditComponent>;
  let component: RecipeEditComponent;
  let storeSpy: jasmine.SpyObj<Store<fromApp.AppState>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let RECIPE_MOCK;
  beforeEach(()=> {
    RECIPE_MOCK = new Recipe('mock', 'mock', 'mock', [new Ingredient('mock',1)]);
    storeSpy = jasmine.createSpyObj('Store', ['select','dispatch']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);

    TestBed.configureTestingModule({
      declarations: [RecipeEditComponent],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy}
      ],
      imports: [ReactiveFormsModule]
    })
    fixture = TestBed.createComponent(RecipeEditComponent);
    component = fixture.componentInstance;
  });

  it("should subscribe to params", () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    activatedRouteSpy.params = of({ id: "0" });
    fixture.detectChanges();
    expect(component.id).toBe(0);
  });

  it("should update form", () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    component.id = 0;
    component.editMode = true;
    component['initForm']();
    expect(component.recipeForm.get('name').value).toBe('mock');
  });

  it("should call store dispatch on submit if is edit mode and form is valid", () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    activatedRouteSpy.params = of({ id: "0" });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('form')).query(By.css('.btn-success'));
    submitButton.nativeElement.click();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it("should call store dispatch on submit if is not edit mode and form is valid", async () => {
    activatedRouteSpy.params = of({ id: null });
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    const submitButton = form.query(By.css('.btn-success'));
    const formInputs = form.queryAll(By.css('input'));
    const formTextArea = form.query(By.css('textarea'));
    const nameInput: HTMLInputElement = formInputs[0].nativeElement;
    const imageURLInput: HTMLInputElement = formInputs[1].nativeElement;
    const descriptionTextArea: HTMLTextAreaElement = formTextArea.nativeElement;
    nameInput.value = "test";
    imageURLInput.value = "test";
    descriptionTextArea.value = "test";
    nameInput.dispatchEvent(new Event('input'));
    imageURLInput.dispatchEvent(new Event('input'));
    descriptionTextArea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.recipeForm.get('name').value);
      submitButton.nativeElement.click();
      expect(storeSpy.dispatch).toHaveBeenCalled();
    });
  });

  it("should add new ingredient", async () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    activatedRouteSpy.params = of({ id: "0" });
    fixture.detectChanges();
    const formArray = fixture.debugElement.query(By.directive(FormArrayName));
    const addIngredientBtn = formArray.query(By.css('.btn-success'));
    addIngredientBtn.triggerEventHandler('click',null);
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.recipeForm.get('ingredients').value.length).toBe(2));
  });

  it("should remove ingredient", async () => {
    storeSpy.select.and.returnValue(of({ recipes: [RECIPE_MOCK] }));
    activatedRouteSpy.params = of({ id: "0" });
    fixture.detectChanges();
    const formArray = fixture.debugElement.query(By.directive(FormArrayName));
    const removeIngredientBtn = formArray.query(By.css('.btn-danger'));
    removeIngredientBtn.triggerEventHandler('click',null);
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(component.recipeForm.get('ingredients').value.length).toBe(0));
  });
})