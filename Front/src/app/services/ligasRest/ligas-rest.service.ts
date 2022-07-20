import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRestService } from '../userRest/user-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LigasRestService {
  httOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.userRest.getToken()
  })
  constructor(
    private http: HttpClient,
    private userRest: UserRestService
  ) {  }
  
 /*getLiga(id: string){
    return this.http.get(environment.baseUrl + 'liga/getLiga/' + id, {headers:this.httOptions});
  };*/

  getLigas(){
    return this.http.get(environment.baseUrl + 'liga/getLigas', {headers: this.httOptions});
  };

  saveLiga(params: {}){
    return this.http.post(environment.baseUrl + 'liga/saveLiga', params, {headers:this.httOptions});
    };
  
  deleteLiga(id: string){
    return this.http.delete(environment.baseUrl + 'liga/deleteLiga/' + id, {headers:this.httOptions});
   };

  }

  