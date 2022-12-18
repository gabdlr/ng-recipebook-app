import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import * as fromApp from './../store/app.reducer';
import * as AuthActions from './store/auth.actions'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  private storeSub: Subscription;
  constructor(private store: Store<fromApp.AppState>,
              //private componentFactoryResolver: ComponentFactoryResolver
              ) { }
  @ViewChild(PlaceholderDirective, {static:false}) alertHost: PlaceholderDirective;

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error){
        this.showErrorAlert(this.error)
      }
    })
  }

  onSwitchMode():void {
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    if(!this.isLoginMode){
      this.store.dispatch(new AuthActions.SingupStart(form.value));
    }else{
      this.store.dispatch(new AuthActions.LoginStart(form.value));
    }

    form.reset();
  }

  onHandleError():void{
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(messagge: string){
    //This was necessary in previous angular versions but it is now deprecated
    //const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    //This was necessary in previous angular versions but it is now deprecated
    //const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    const componentRef = hostViewContainerRef.createComponent(AlertComponent)
    componentRef.instance.messagge = messagge;
    const subscription: Subscription = componentRef.instance.close.subscribe(()=> {
      subscription.unsubscribe();
      hostViewContainerRef.clear();
    })
  }

  ngOnDestroy(){
    this.storeSub.unsubscribe();
  }
}
