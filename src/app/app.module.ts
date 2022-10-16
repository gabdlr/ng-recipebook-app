import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { ShoppingListRoutingModule } from './shopping-list/shopping-list-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    AuthRoutingModule,
    HttpClientModule,
    ShoppingListModule,
    ShoppingListRoutingModule
  ],
  providers: [
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptorService,
                 multi:true
              }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
