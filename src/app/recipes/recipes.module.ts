import { NgModule } from "@angular/core";
import { RecipesComponent } from './../recipes/recipes.component';
import { RecipeListComponent } from './../recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './../recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './../recipes/recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './../recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './../recipes/recipe-edit/recipe-edit.component';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RecipesRoutingModule } from "./recipes-routing.module";

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    imports:[
        SharedModule,
        ReactiveFormsModule,
        RouterModule,
        RecipesRoutingModule
    ]
})
export class RecipesModule {}