import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BugService} from "../bug.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-bug-edit',
  templateUrl: './bug-edit.component.html',
  styleUrls: ['./bug-edit.component.scss']
})
export class BugEditComponent implements OnInit{
  bugForm!: FormGroup;
  id ?: string;
  editMode : boolean = false;
  newMode : boolean = false;
  constructor(private formBuilder: FormBuilder,private bugService  : BugService,private router : Router, private snackBar: MatSnackBar,private route : ActivatedRoute) {
    this.bugForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      reporter: ['', Validators.required],
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

  ngOnInit(){
    if(this.editMode) {
      this.bugService.get(this.id!).subscribe(res=> {
       this.bugForm.patchValue(res);
      })
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
}
