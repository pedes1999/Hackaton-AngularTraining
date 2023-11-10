import {Component, HostListener, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BugService} from "../bug.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentDto} from "../../dtos/comment.dto";
import {CanComponentDeactivate} from "../../can-deactivate.guard";

@Component({
  selector: 'app-bug-edit',
  templateUrl: './bug-edit.component.html',
  styleUrls: ['./bug-edit.component.scss']
})
export class BugEditComponent implements OnInit, CanComponentDeactivate {
  bugForm!: FormGroup;
  id ?: string;
  editMode: boolean = false;
  newMode: boolean = false;

  constructor(private formBuilder: FormBuilder, private bugService: BugService, private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.bugForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      reporter: ['', Validators.required],
      comments: this.formBuilder.array([
        this.formBuilder.group({
          name: '',
          description: ''
        })]),
      status: [''],
      created: [new Date()]
    });
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.editMode = true;

    } else {
      this.newMode = true;
    }
  }

  get comments(): FormArray {
    return this.bugForm.get('comments') as FormArray;
  }
  set comments(data: any) {
    this.bugForm.get('comments')?.patchValue(data);
  }

  /**
   * CanDeactivate guard to check whether the user can leave the current page.
   * @returns {boolean} True if the user can leave the page, false if they should stay.
   */
  @HostListener("window:beforeunload")
  canDeactivate() {
    if (this.bugForm.dirty) {
      return confirm('Are you sure you want to leave?');
    }
    return true;
  }

  /**
   * Lifecycle hook called after component initialization.
   * Handles initialization logic for edit mode and sets up form controls.
   */
  ngOnInit() {
    if (this.editMode) {
      this.bugService.get(this.id!).subscribe(res => {
        this.bugForm.patchValue(res);

        // Clear existing comments before pushing new ones
        while (this.comments.length !== 0) {
          this.comments.removeAt(0);
        }
        if (res.comments) {
          res.comments.forEach((comment: CommentDto) => {
            const commentFormGroup = this.formBuilder.group({
              description: comment.description,
              name: comment.name,
            });
            this.comments.push(commentFormGroup);
          });
        }
      });

    }
    this.bugForm.controls['reporter'].valueChanges.subscribe(value => {
      if (value === 'QA') {
        this.bugForm.controls['status'].setValidators([Validators.required]);
        this.bugForm.controls['status'].updateValueAndValidity();
        this.bugForm.controls['status'].markAsTouched()
        console.log(this.bugForm.valid)
      } else {
        this.bugForm.controls['status'].clearValidators();
        this.bugForm.controls['status'].updateValueAndValidity();
      }
    });
  }
  /**
   * Handles form submission, either creating a new bug or editing an existing one.
   * Displays a snack bar message upon success or shows an error message.
   */
  onSubmit() {
    if (this.bugForm.valid) {
      if (!this.id) {
        this.bugService.createBug(this.bugForm.value).subscribe(res => {
          this.bugForm.markAsPristine();
          this.router.navigate(['bugs'])
          this.snackBar.open("Bug created successfully!", "Close", {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          })
        })
      } else {
        this.bugService.editBug(this.id, this.bugForm.value).subscribe(res => {
          this.bugForm.markAsPristine();
          this.router.navigate(['bugs'])
          this.snackBar.open("Bug edited successfully!", "Close", {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          })
        })
      }
    } else {
      this.markFormGroupAsTouched(this.bugForm)
      this.snackBar.open('Form is invalid. Please fill out all required fields.', 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }
  /**
   * Recursively marks all form controls within a FormGroup as touched.
   *
   * @param formGroup - The FormGroup to mark controls as touched
   */
  markFormGroupAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  back() {
    this.router.navigate(['bugs']);
  }

  /**
   * Adds a new comment form group to the comments FormArray.
   */
  addComment() {
    const commentsArray = this.comments;
    const newComment = this.formBuilder.group({
      name: '',
      description: ''
    });
    commentsArray.push(newComment);

  }

  /**
   * Saves a comment by calling the bug service to edit the bug with the updated comment.
   *
   * @param i - The index of the comment in the comments FormArray
   */
  saveComment(i: number) {
    this.bugService.editBug(this.id!, this.bugForm.value).subscribe(res => {
      this.snackBar.open("Comment saved successfully!", "Close", {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      })
    });
  }
}
