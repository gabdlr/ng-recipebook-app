import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { Store } from "@ngrx/store";
import * as AuthActions from "./auth/store/auth.actions";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let storeSpy: jasmine.SpyObj<Store>;
  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj(Store, ["dispatch"]);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [{ provide: Store, useValue: storeSpy }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should call dispatch on init", () => {
    fixture.detectChanges();
    expect(storeSpy.dispatch).toHaveBeenCalledOnceWith(
      new AuthActions.AutoLogin()
    );
  });
});
