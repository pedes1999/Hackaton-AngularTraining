import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {DataSource} from "@angular/cdk/collections";
import {Bug} from "../../dtos/bug.dto";
import {MatTableDataSource} from "@angular/material/table";
import {BugService} from "../bug.service";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.scss']
})
export class BugListComponent implements AfterViewInit{
  displayedColumns: string[] = ['title', 'priority', 'reporter', 'created', 'status'];
  bugs !:  MatTableDataSource<Bug>;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private service : BugService,private router : Router) {
    this.service.getAllBugs().subscribe(bugList => {
      console.log(bugList)
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
    this.router.navigate(['new'])
  }
}
