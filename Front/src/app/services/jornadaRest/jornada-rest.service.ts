import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRestService } from '../userRest/user-rest.service';
@Injectable({
  providedIn: 'root'
})
export class JornadaRestService {
  httpOptions = new HttpHeaders({
    'Content-type' : 'application/json',
    'Authorization' : this.userRest.getToken()

  })
  constructor(
    private http: HttpClient,
    private userRest: UserRestService
  ) { }


  getJornadas(){
    return this.http.get(environment.baseUrl + 'jornadas/getJornada', {headers: this.httpOptions});
  }

  saveJornada(params: {}){
    return this.http.post(environment.baseUrl + 'jornadas/saveJornada', params, {headers: this.httpOptions});
  }
}
