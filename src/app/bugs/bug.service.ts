import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bug} from "../dtos/bug.dto";
import {Subject} from "rxjs";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class BugService{
  endpoint = 'http://localhost:3000/bugs'
  filterSubject : Subject<any> = new Subject<FormGroup>();
  constructor(private http : HttpClient) { }



  createBug(newBug : Bug) {
    return this.http.post<any>(this.endpoint , newBug);
  }
  editBug(id : string,editedBug : Bug) {
    return this.http.put<any>(this.endpoint + `/${id}`, editedBug);
  }
  get(id : string) {
    return this.http.get<any>(this.endpoint + `/${id}`);
  }

  delete(id : string) {
    return this.http.delete<any>(this.endpoint + `/${id}`);
  }

  getAllBugsPaginated(page: number, pageSize: number,sort : string) {
    const url = `${this.endpoint}?_sort=${sort}&page=${page}&size=${pageSize}`;
    return this.http.get<any>(url);
  }

}
