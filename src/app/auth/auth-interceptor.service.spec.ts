import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthInterceptorService } from "./auth-interceptor.service";
import { Store, StoreModule, StoreRootModule } from "@ngrx/store";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { AuthenticateSuccess } from "./store/auth.actions";
import * as fromApp from './../store/app.reducer'
describe("auth interceptor service", () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot(fromApp.appReducer), StoreRootModule],
      providers: [
        Store,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should add auth headers with user token", () => {
    const url = "/mockendpoint";
    const AUTH_OBJ_MOCK = {
      email: "mock",
      userId: "mock",
      token: "mock",
      expirationDate: new Date("9999"),
      redirect: false,
    };
    store.dispatch(new AuthenticateSuccess(AUTH_OBJ_MOCK));
    httpClient.get(url).subscribe();
    const req = httpTestingController.expectOne("/mockendpoint?auth=mock");
    expect(req.request.params.get("auth")).toEqual(AUTH_OBJ_MOCK.token);
  });

  it("should not modify request as there user logged in", () => {
    const url = "/mockendpoint";
    httpClient.get(url).subscribe();
    httpTestingController.expectOne("/mockendpoint");
  });
});
