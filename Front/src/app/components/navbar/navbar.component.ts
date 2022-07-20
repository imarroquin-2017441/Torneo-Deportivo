import { Component, OnInit } from '@angular/core';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token:any;

  constructor(
    private userRest: UserRestService
  ) { }

  ngOnInit(): void {
    this.token = this.userRest.getToken();
  }

  logOut(){
    localStorage.clear();
  }

}
