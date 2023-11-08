import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BugListComponent} from "./bugs/bug-list/bug-list.component";
import {BugEditComponent} from "./bugs/bug-edit/bug-edit.component";

const routes: Routes = [
  {
    path: "" , component : BugListComponent
  },
  {
    path : "new" , component:BugEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
