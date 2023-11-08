import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Bug} from "../../dtos/bug.dto";
import {MatTableDataSource} from "@angular/material/table";
import {BugService} from "../bug.service";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs";

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss']
})
export class BugListComponent implements AfterViewInit{
  displayedColumns: string[] = ['title', 'priority', 'reporter', 'created', 'status','actions'];
  bugs !:  MatTableDataSource<Bug>;
  bugList! : Bug[];
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private service : BugService,private router : Router,private snackBar : MatSnackBar) {
  this.getAllBugs();
  }

  getAllBugs(){
    this.service.getAllBugs().subscribe(bugList => {
      this.bugList = bugList;
      this.bugs = new MatTableDataSource(bugList);
    })
  }
  ngAfterViewInit() {
   this.handleSortChanged();
  }

  private handleSortChanged() {
    this.sort.sortChange.subscribe((onNext: { active: string; direction: string; }) => {

        this.bugs.data = this.sortData(this.bugs.data, onNext.active, onNext.direction);
    }
    )
  };

  private sortData(data: Bug[], active: string, direction: string): Bug[] {
    return data.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (active) {
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'priority':
          return this.compare(a.priority, b.priority, isAsc);
        case 'reporter':
          return this.compare(a.reporter, b.reporter, isAsc);
        case 'created':
          return this.compare(new Date(a.created), new Date(b.created), isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    return (a<b? -1:1) * (isAsc ? 1 : -1);
  }

  newBug() {
    this.router.navigate([ 'bugs/new']);
  }


  edit(i : number ) {
       const id = this.bugList[i].id;
       this.router.navigate(['bug' , id ])
  }
  delete(i : number ) {
    const id = this.bugList[i].id;
    this.service.delete(id).pipe(
      finalize(() => {
        this.bugList.splice(i, 1);
        this.bugs.data = this.bugList;
      })
    ).subscribe(res => {
      this.snackBar.open('Bug with Title ' + this.bugList[i].title + ' deleted Successfully', 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    });
  }
}
