import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("Header component", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let storeService: any;

  beforeEach(() => {
    storeService = jasmine.createSpyObj(["select", "dispatch"]);
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: Store, useValue: storeService }],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    storeService.select.and.returnValue(
      of({
        user: "juanito",
        authError: null,
        loading: false,
      })
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should call dispatch when save data anchor element is clicked", () => {
    storeService.select.and.returnValue(
      of({
        user: "juanito",
        authError: null,
        loading: false,
      })
    );
    fixture.detectChanges();
    const dropdownMenu = fixture.debugElement.query(By.css(".dropdown-menu"));
    const saveDataAnchorEl = dropdownMenu.query(By.css("a"));
    saveDataAnchorEl.triggerEventHandler("click", null);
    expect(storeService.dispatch).toHaveBeenCalled();
  });

  it("should call dispatch when save data anchor element is clicked", () => {
    storeService.select.and.returnValue(
      of({
        user: "juanito",
        authError: null,
        loading: false,
      })
    );
    fixture.detectChanges();
    const dropdownMenu = fixture.debugElement.query(By.css(".dropdown-menu"));
    const saveDataAnchorEl = dropdownMenu.query(By.css("a"));
    saveDataAnchorEl.triggerEventHandler("click", null);
    expect(storeService.dispatch).toHaveBeenCalled();
  });

  it("should call dispatch when fetch data anchor element is clicked", () => {
    storeService.select.and.returnValue(
      of({
        user: "juanito",
        authError: null,
        loading: false,
      })
    );
    fixture.detectChanges();
    const dropdownMenu = fixture.debugElement.query(By.css(".dropdown-menu"));
    const dropdownMenuAnchorElArray = dropdownMenu.queryAll(By.css("a"));
    const fetchDataAnchorEl = dropdownMenuAnchorElArray[1];
    fetchDataAnchorEl.triggerEventHandler("click", null);
    expect(storeService.dispatch).toHaveBeenCalled();
  });

  it("should call dispatch when logout anchor element is clicked", () => {
    storeService.select.and.returnValue(
      of({
        user: "juanito",
        authError: null,
        loading: false,
      })
    );
    fixture.detectChanges();
    const rightNavbarEl = fixture.debugElement.query(By.css(".navbar-right"));
    const logoutAnchorEl = rightNavbarEl.query(By.css('a'));
    logoutAnchorEl.triggerEventHandler('click',null);
    expect(storeService.dispatch).toHaveBeenCalled();
  });
});
