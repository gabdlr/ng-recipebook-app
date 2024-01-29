import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { Store } from "@ngrx/store";
import * as AuthActions from "./auth/store/auth.actions";

describe("AuthService", () => {
  let service: AuthService;
  let storeSpy: jasmine.SpyObj<Store>;
  const MOCK_EXPIRATION_DURATION = 1000;
  beforeEach(() => {
    storeSpy = jasmine.createSpyObj(Store, ["dispatch"]);
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeSpy }],
    });
    service = TestBed.inject(AuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set expiration timer and call dispatch when time is up", fakeAsync(() => {
    service.setLogoutTimer(MOCK_EXPIRATION_DURATION);
    expect(service["tokenExpirationTimer"]).toBeTruthy();
    tick(MOCK_EXPIRATION_DURATION);
    expect(storeSpy.dispatch).toHaveBeenCalledOnceWith(
      new AuthActions.Logout()
    );
  }));

  it("should clear the timer if set", () => {
    service.setLogoutTimer(MOCK_EXPIRATION_DURATION);
    service.clearLogoutTimer();
    expect(service["tokenExpirationTimer"]).toBe(null);
  });
});
