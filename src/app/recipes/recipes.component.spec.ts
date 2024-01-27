import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecipesComponent } from "./recipes.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("recipes component", () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[RecipesComponent],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
})