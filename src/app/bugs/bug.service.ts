import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bug} from "../dtos/bug.dto";

@Injectable({
  providedIn: 'root'
})
export class BugService{
  endpoint = 'http://localhost:3000/bugs'
  constructor(private http : HttpClient) { }

  getAllBugs() {
    return this.http.get<any>(this.endpoint);
  }

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
}
