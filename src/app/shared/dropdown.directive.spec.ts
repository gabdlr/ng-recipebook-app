import { Component } from "@angular/core";
import { DropdownDirective } from "./dropdown.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
  selector: 'test-mock',
  template: '<div appDropdown></div><span>no directive</span>',
  styles: [],
})
class MockComponent {

}

describe("", () => {
  let fixture: ComponentFixture<MockComponent>;
  let component: MockComponent;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent, DropdownDirective]
    }).compileComponents()
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be closed", () => {
    const elementWithTheDirective = fixture.debugElement.query(By.directive(DropdownDirective));
    expect(Array.from((<HTMLDivElement> elementWithTheDirective.nativeElement).classList)).not.toContain("open");
  });

  it("should open on click (in the element with the directive)", () => {
    const elementWithTheDirective = fixture.debugElement.query(By.directive(DropdownDirective));
    elementWithTheDirective.nativeElement.click();
    fixture.detectChanges();
    expect(Array.from((<HTMLDivElement> elementWithTheDirective.nativeElement).classList)).toContain("open");
  });

  it("should close on click (on anywhere but the element with the directive)", () => {
    const span = fixture.debugElement.query(By.css('span'));
    const elementWithTheDirective = fixture.debugElement.query(By.directive(DropdownDirective));
    elementWithTheDirective.nativeElement.click();
    fixture.detectChanges();
    (<HTMLSpanElement> span.nativeElement).click();
    fixture.detectChanges();
    expect(Array.from((<HTMLDivElement> elementWithTheDirective.nativeElement).classList)).not.toContain("open");
  });
});