import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PlaceholderDirective } from "./placeholder.directive";

@Component({
  selector: "test-mock",
  template: "<div appPlaceholder></div>",
  styles: [],
})
class MockComponent {}

describe("placeholder directive", () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent, PlaceholderDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
