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
  /**
   * Applies the current filter criteria and notifies the BugService to filter the bug list accordingly.
   * Invoked when the user clicks the "Filter" button.
   */
  filter() {
    this.service.filterSubject.next(this.filterForm.value);
  }
  /**
   * Clears all filters, resets the filter form, and notifies the BugService to display the unfiltered bug list.
   * Invoked when the user clicks the "Clear Filters" button.
   */
  clearFilters() {
    this.service.filterSubject.next(null);
    this.filterForm.reset();
  }
}
