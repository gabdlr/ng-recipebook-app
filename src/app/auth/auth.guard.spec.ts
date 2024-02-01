import { TestBed } from "@angular/core/testing";
import { AuthGuard } from "./auth.guard";
import { Store, StoreModule } from "@ngrx/store";
import { Router, UrlTree } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import * as fromApp from "./../store/app.reducer";
import { User } from "./user.model";
import { Observable, of } from "rxjs";
describe("auth guard", () => {
  let service: AuthGuard;
  let store: Store<fromApp.AppState>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(fromApp.appReducer), RouterTestingModule],
      providers: [AuthGuard],
    });
    service = TestBed.inject(AuthGuard);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it("should allow navigation if the user is authenticated", (done) => {
    const mockUser = {
      user: new User("mock", "mock", "mock", new Date()),
      authError: null,
      loading: false,
    };
    spyOn(store, "select").and.returnValue(of({ user: mockUser }));
    (<Observable<boolean | UrlTree>> service.canActivate(null!, null!)).subscribe((result: boolean | UrlTree) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should navigate to /auth if the user is not authenticated', (done) => {
    spyOn(store, 'select').and.returnValue(of({ user: null }));
    spyOn(router, 'createUrlTree').and.returnValue('/auth' as unknown as UrlTree);
    (<Observable<UrlTree>> service.canActivate(null!, null!)).subscribe((result: UrlTree) => {
      expect(result as unknown as string).toBe('/auth')
      done();
    });
  });
});
