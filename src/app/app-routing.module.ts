import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BugListComponent} from "./bugs/bug-list/bug-list.component";
import {BugEditComponent} from "./bugs/bug-edit/bug-edit.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: "" , component : HomeComponent
  },
  {
    path: "home" , component : HomeComponent
  },
  {
    path: "bugs" , component : BugListComponent
  },
  {
    path : "bugs/new" , component:BugEditComponent
  },
  {
    path: "bug/:id" , component : BugEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
