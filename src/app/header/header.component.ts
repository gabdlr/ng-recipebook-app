import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, Subscription } from "rxjs";
import * as fromApp from './../store/app.reducer';
import * as AuthActions from './../auth/store/auth.actions';
import * as RecipeActions from './../recipes/store/recipe.actions';
@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy{
    collapsed = true;
    isAuthenticated = false;
    private _subscription: Subscription;

    constructor(private store: Store<fromApp.AppState>){}
    
    ngOnInit(): void {
        this._subscription = this.store.select('auth')
            .pipe(map( authState => authState.user))
            .subscribe({
            next: user => {
                this.isAuthenticated = !!user;
            }
        });
        
    }

    onSaveData():void {
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onFetchData():void {
        this.store.dispatch(new RecipeActions.FetchRecipes())
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    onLogout(): void{
        this.store.dispatch(new AuthActions.Logout());
    }
}