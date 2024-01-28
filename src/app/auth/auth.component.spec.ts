import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthComponent } from "./auth.component";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { AlertComponent } from "../shared/alert/alert.component";
import { By } from "@angular/platform-browser";
import { PlaceholderDirective } from "../shared/placeholder.directive";
import * as AuthActions from "./store/auth.actions";

describe("AuthComponent", () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj(Store, ["select", "dispatch"]);
    await TestBed.configureTestingModule({
      declarations: [AuthComponent, AlertComponent, PlaceholderDirective],
      providers: [{ provide: Store, useValue: storeSpy }],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    const AUTH_STATE_MOCK = {
      user: null,
      authError: null,
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should show error on login error", () => {
    const AUTH_STATE_MOCK = {
      user: null,
      authError: "Error mock",
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    expect(component.error).toBe(AUTH_STATE_MOCK.authError);
  });

  it("should switch mode when switch button is clicked", () => {
    const LOGIN_TEXT = "Login";
    const SINGUP_TEXT = "Sign Up";
    const AUTH_STATE_MOCK = {
      user: null,
      authError: null,
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    const formButtons = fixture.debugElement.queryAll(By.css("button"));
    const actionButton = formButtons[0];
    expect(actionButton.nativeElement.textContent).toBe(LOGIN_TEXT);
    const switchButton = formButtons[1];
    switchButton.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(actionButton.nativeElement.textContent).toBe(SINGUP_TEXT);
  });

  it("should not perform any action on submit if form is invalid", () => {
    const AUTH_STATE_MOCK = {
      user: null,
      authError: null,
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    component.onSubmit({ valid: false } as any);
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it("should call store dispatch with LoginStart action when the form is valid and submitted in login mode", () => {
    const FORM_VALUE_MOCK = {
      email: "mock@mock.com",
      password: "123456",
      returnSecureToken: true,
    };
    const AUTH_STATE_MOCK = {
      user: null,
      authError: null,
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    expect(component.isLoginMode).toBeTrue();
    expect(component.isLoading).toBeFalse();
    component.onSubmit({
      valid: true,
      value: FORM_VALUE_MOCK,
      reset: () => void 0,
    } as any);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      new AuthActions.LoginStart(FORM_VALUE_MOCK)
    );
  });

  it("should call store dispatch with SignUpStart action when the form is valid and submitted in sing up mode", () => {
    const FORM_VALUE_MOCK = {
      email: "mock@mock.com",
      password: "123456",
      returnSecureToken: true,
    };
    const AUTH_STATE_MOCK = {
      user: null,
      authError: null,
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    const switchButton = fixture.debugElement.queryAll(By.css("button"))[1];
    switchButton.triggerEventHandler("click", null);
    expect(component.isLoginMode).toBeFalse();
    component.onSubmit({
      valid: true,
      value: FORM_VALUE_MOCK,
      reset: () => void 0,
    } as any);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      new AuthActions.SingupStart(FORM_VALUE_MOCK)
    );
  });

  it("should trigger alert component and clear when dismissed", () => {
    const AUTH_STATE_MOCK = {
      user: null,
      authError: "mock",
      loading: false,
    };
    storeSpy.select.and.returnValue(of(AUTH_STATE_MOCK));
    fixture.detectChanges();
    const spy = spyOn<any>(component.alertHost.viewContainerRef, "clear");
    component["showErrorAlert"]("mock");
    expect(spy).toHaveBeenCalled();
    const test = fixture.debugElement
      .query(By.css(".alert-box"))
      .query(By.css(".btn-primary"));
    test.triggerEventHandler("click", null);
    expect(spy).toHaveBeenCalled();
  });
});
