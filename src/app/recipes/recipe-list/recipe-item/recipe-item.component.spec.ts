import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecipeItemComponent } from "./recipe-item.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("recipe item component", () => {
  let component: RecipeItemComponent;
  let fixture: ComponentFixture<RecipeItemComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[RecipeItemComponent],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RecipeItemComponent);
    component = fixture.componentInstance;
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

})