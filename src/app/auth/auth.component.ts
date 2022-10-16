import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) { }
  @ViewChild(PlaceholderDirective, {static:false}) alertHost: PlaceholderDirective;

  ngOnInit(): void {
  }

  onSwitchMode():void {
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit(form:NgForm){
    let authObs: Observable<AuthResponseData>
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    if(!this.isLoginMode){
      authObs = this.authService.singup(form.value);
    }else{
      authObs = this.authService.login(form.value);
    }

    authObs
    .subscribe({
      next: response => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (error: string) => {
        this.error = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    });
    form.reset();
  }

  onHandleError():void{
    this.error = null;
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

}
