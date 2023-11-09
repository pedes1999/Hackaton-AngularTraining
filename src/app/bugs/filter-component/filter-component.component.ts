import {Component, EventEmitter, Output} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BugService} from "../bug.service";

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.scss']
})
export class FilterComponentComponent {
   filterForm !: FormGroup
  constructor(private fb : FormBuilder,private service : BugService) {
    this.filterForm  =  this.fb.group({
      title: [],
      priority: [],
      reporter: [],
      status: [],
      created : []
    })
  }

  filter() {
    this.service.filterSubject.next(this.filterForm.value);
  }

  clearFilters() {
    this.service.filterSubject.next(null);
    this.filterForm.reset();
  }
}
