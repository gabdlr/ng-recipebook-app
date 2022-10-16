import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './auth/user.model';
import { environment } from 'src/environments/environment';

const firebaseErrors = {
  EMAIL_EXISTS:'This email address is already taken',
  OPERATION_NOT_ALLOWED:'Operation not allowed',
  TOO_MANY_ATTEMPTS_TRY_LATER:'Too many wrong attempts, try again later',
  EMAIL_NOT_FOUND:'Wrong credentials',
  INVALID_PASSWORD:'Wrong credentials',
  USER_DISABLED:'This account has been disabled'
};


export interface AuthResponseData {
  idToken:	string
  email:	string	
  refreshToken:	string
  expiresIn:	string	
  localId:	string
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private httpClient: HttpClient,
              private router: Router) { }

  singup(singupData: {email:string,password:string,returnSecureToken:boolean}){
    return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,singupData)
    .pipe(catchError(this.handleError));
  }

  login(loginData:{email:string,password:string}){
    return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,loginData)
    .pipe(
      catchError(this.handleError), 
      tap(res => {
        this.handleAuthentication(res.email,res.localId,res.idToken,+res.expiresIn)
      })
    );
  }

  autoLogin():void{

    const userData: {
      email: string, 
      id: string, 
      _token: string, 
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }

    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }

  }

  logout():void{
    this.user.next(null);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number):void{
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    },expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        //Firebase gives us the expiration time in seconds * 1000 converts it to ms
        //and the when add that to a new Date (in ms) to get the Date when it expires
        const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
        const user = new User(email,userId,token,expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000);
        localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse){
    let errorMessage = 'An unknown error has occurred';
    errorMessage = firebaseErrors[errorResponse.error.error.message] ?? errorMessage;
    let error = new Error(errorMessage);
    return throwError(() => error.message)
  }

}
