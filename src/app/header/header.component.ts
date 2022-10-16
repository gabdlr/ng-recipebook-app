import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy{
    collapsed = true;
    isAuthenticated = false;
    private _subscription: Subscription;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService){}
    
    ngOnInit(): void {
        this._subscription = this.authService.user.subscribe({
            next: user => {
                this.isAuthenticated = !!user;
            }
        });
        
    }

    onSaveData():void {
        this.dataStorageService.storeRecipes();
    }

    onFetchData():void {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    onLogout(): void{
        this.authService.logout();
    }
}