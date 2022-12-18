import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from './../store/app.reducer'
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private store: Store<fromApp.AppState>){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth')
        .pipe(
          take(1),
          map( authState => {
            return authState.user
          }),
          //ExhaustMap concatena los dos observables
          exhaustMap(user => {
            if(user){
                const modifiedRequest = req.clone({params: new HttpParams().set('auth',user.token)});
                return next.handle(modifiedRequest);
            }
            return next.handle(req)
          })
        )
        ;
    }
}