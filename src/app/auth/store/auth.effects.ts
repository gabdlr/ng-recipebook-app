import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "src/app/auth.service";
import { environment } from "src/environments/environment";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken:	string
    email:	string	
    refreshToken:	string
    expiresIn:	string	
    localId:	string
    registered?: boolean;
  }

const handleAuthentication = (resData:AuthResponseData) => {
    const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
    const user: User = new User(resData.email,resData.localId,resData.idToken,expirationDate);
    localStorage.setItem('userData',JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: resData.email,
        userId: resData.localId, 
        token: resData.idToken,
        expirationDate: expirationDate,
        redirect: true
    });
}


const handleError = (error: HttpErrorResponse) => {
    const firebaseErrors = {
        EMAIL_EXISTS:'This email address is already taken',
        OPERATION_NOT_ALLOWED:'Operation not allowed',
        TOO_MANY_ATTEMPTS_TRY_LATER:'Too many wrong attempts, try again later',
        EMAIL_NOT_FOUND:'Wrong credentials',
        INVALID_PASSWORD:'Wrong credentials',
        USER_DISABLED:'This account has been disabled'
    };
    let errorMessage = 'An unknown error has occurred';
    errorMessage = firebaseErrors[error.error.error.message] ?? errorMessage;
    return of(new AuthActions.AuthenticateFail(errorMessage))
}

@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions,
                private authService: AuthService,
                private httpClient: HttpClient,
                private router: Router){}        
    
    authLogin$ = createEffect( () => {
        return this.actions$
            .pipe(
                ofType(AuthActions.LOGIN_START),
                switchMap((authData: AuthActions.LoginStart) => {
                    return this.httpClient.post<AuthResponseData>(
                        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                        authData.payload)
                    .pipe(
                        tap( resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                        map(resData => {
                           return handleAuthentication(resData); 
                        }),
                        catchError((error: HttpErrorResponse) => {
                            return handleError(error);
                        })
                    )
                })    
            )
    });

    authRedirect$ = createEffect(() => {
        return this.actions$
        .pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap((authSuccessAction:AuthActions.AuthenticateSuccess) => {
                if(authSuccessAction.payload.redirect){
                    this.router.navigate(['/']);
                }
            })
        )
    },{dispatch:false});

    authSingup$ = createEffect(()=>{
        return this.actions$
        .pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SingupStart) => {
                return this.httpClient.post<AuthResponseData>(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,signupAction.payload
                )
                .pipe(
                    tap( resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                    map(resData => {
                        return handleAuthentication(resData); 
                    }),
                    catchError((error: HttpErrorResponse) => {
                        return handleError(error);
                    })
                )
            })
        )
    });

    authLogout$ = createEffect(() => {
        return this.actions$
        .pipe(
            ofType(AuthActions.LOGOUT),
            tap(()=>{
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth'])
            })
        )
    },{dispatch:false})

    autoLogin$ = createEffect(() => {
        return this.actions$
        .pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string, 
                    id: string, 
                    _token: string, 
                    _tokenExpirationDate: string
                } = JSON.parse(localStorage.getItem('userData'));
                if(!userData){
                    return {type: 'DUMMY'};
                }
              
                const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
                if(loadedUser.token){
                    const expirationDuration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration)
                    return new AuthActions.AuthenticateSuccess({
                        email:loadedUser.email,
                        userId:loadedUser.id,
                        token:loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: false
                    });
                }
                return {type: 'DUMMY'}
            })
        )
    });

}