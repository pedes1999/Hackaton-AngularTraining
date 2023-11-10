import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Bug} from "../../dtos/bug.dto";
import {MatTableDataSource} from "@angular/material/table";
import {BugService} from "../bug.service";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {filter, finalize} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss']
})
export class BugListComponent implements OnInit,AfterViewInit{
  displayedColumns: string[] = ['title', 'priority', 'reporter', 'created', 'status','actions'];
  bugs !:  MatTableDataSource<Bug>;
  bugList! : Bug[];
  @ViewChild(MatSort) sort!: MatSort;
  filterForm !: any;
  pageSizeOptions: number[] = [5, 10, 15];
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private service : BugService,private router : Router,private snackBar : MatSnackBar) {
  this.getAllBugs();
  }

  getAllBugs(){
    this.service.getAllBugsPaginated(0, this.pageSize,'title,asc').subscribe((bugList) => {
      this.bugList = bugList;
      this.bugs = new MatTableDataSource(bugList);
      this.bugs.paginator = this.paginator;
    });
  }

  ngOnInit(){
    this.service.filterSubject.subscribe(filterForm => {
      this.filterForm = filterForm;
      if(this.filterForm) {
        this.applyFilter();
        return;
      }
      this.getAllBugs()
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
    const indexInAllBugs = this.currentPage * this.pageSize + i;
    const id = this.bugList[indexInAllBugs].id;
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

  applyFilter() {
    let filteredData = [...this.bugList];

    // Apply filtering based on form values
    if (this.filterForm.title) {
      filteredData = filteredData.filter(bug => bug.title.toLowerCase().includes(this.filterForm.title.toLowerCase()));
    }

    if (this.filterForm.priority) {
      filteredData = filteredData.filter(bug => bug.priority === this.filterForm.priority);
    }

    if (this.filterForm.reporter) {
      filteredData = filteredData.filter(bug => bug.reporter === this.filterForm.reporter);
    }

    if (this.filterForm.created) {
       this.convertToStringDate(this.filterForm.created);
      filteredData = filteredData.filter(bug =>  this.convertToStringDate(bug.created) ===  this.convertToStringDate(this.filterForm.created));
    }

    if (this.filterForm.status) {
      filteredData = filteredData.filter(bug => bug.status === this.filterForm.status);
    }

    this.bugs.data = filteredData;
    console.log(this.bugs.data)
  }

  convertToStringDate(date : any) : string {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.toLocaleString('default', { month: 'long' }); // Convert month to full month name
    const day = dateObject.getDate();


    return  `${day} ${month} ${year}`;


  }

  onPageChange(event: PageEvent) {
    this.currentPage  = event.pageIndex;
    const pageSize = event.pageSize;
    const sort = 'title,desc';
    this.service.getAllBugsPaginated(this.currentPage, pageSize,sort).subscribe(bugList => {
      this.bugs.data = bugList;
    });
  }
}
