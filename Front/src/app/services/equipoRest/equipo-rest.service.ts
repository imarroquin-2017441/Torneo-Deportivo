import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class equipoRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.userRest.getToken()
  })
  constructor(
    private http: HttpClient,
    private userRest: UserRestService
  ) { }

  getEquipos(){
    return this.http.get(environment.baseUrl + 'equipo/getEquipos', {headers:this.httpOptions});
  };

  deleteEquipo(id: string){
    return this.http.delete(environment.baseUrl + 'equipo/deleteEquipo/' + id, {headers:this.httpOptions});
   };

   saveEquipo(params: {}){
    return this.http.post(environment.baseUrl + 'equipo/saveEquipo', params, {headers:this.httpOptions});
  };
}
