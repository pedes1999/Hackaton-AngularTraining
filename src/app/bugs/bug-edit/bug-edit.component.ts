import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BugService} from "../bug.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentDto} from "../../dtos/comment.dto";

@Component({
  selector: 'app-bug-edit',
  templateUrl: './bug-edit.component.html',
  styleUrls: ['./bug-edit.component.scss']
})
export class BugEditComponent implements OnInit{
  bugForm!: FormGroup;
  id ?: string;
  commentsForm !: FormGroup;
  editMode : boolean = false;
  newMode : boolean = false;
  constructor(private formBuilder: FormBuilder,private bugService  : BugService,private router : Router, private snackBar: MatSnackBar,private route : ActivatedRoute) {
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
      created : [new Date()]
    });
    this.id = this.route.snapshot.params['id'];
    if(this.id) {
      this.editMode = true;

    } else {
      this.newMode = true;
    }
  }
  get comments(): FormArray {
    return this.bugForm.get('comments') as FormArray;
  }
  set comments(data:any){
    this.bugForm.get('comments')?.patchValue(data);
  }
  ngOnInit(){

    if(this.editMode) {
      this.bugService.get(this.id!).subscribe(res=> {
        this.bugForm.patchValue(res);

        // Clear existing comments before pushing new ones
        while (this.comments.length !== 0) {
          this.comments.removeAt(0);
        }
    if(res.comments) {
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
  onSubmit() {
    if (this.bugForm.valid) {
      if(!this.id) {
        this.bugService.createBug(this.bugForm.value).subscribe(res => {
          this.router.navigate(['bugs'])
          this.snackBar.open("Bug created successfully!", "Close", {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          })
        })
      } else {
        this.bugService.editBug(this.id,this.bugForm.value).subscribe(res => {
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
  addComment() {
    const commentsArray = this.comments;
    const newComment = this.formBuilder.group({
      name: '',
      description: ''
    });
    commentsArray.push(newComment);

  }
  saveComment(i : number){
    this.bugService.editBug(this.id!,this.bugForm.value).subscribe(res => {
      this.snackBar.open("Comment saved successfully!", "Close", {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      })
    });
  }
}
