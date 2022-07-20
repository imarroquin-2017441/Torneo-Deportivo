import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:UserModel;

  constructor(
    private userRest: UserRestService,
    public router: Router
  ) { 
    this.user = new UserModel('','','','','','');
  }

  ngOnInit(): void {
  }

  login(){
    this.userRest.login(this.user).subscribe({
      next: (res:any)=>{
        alert(res.message);
        localStorage.setItem('token', res.token);
        localStorage.setItem('identity', JSON.stringify(res.already));
        this.router.navigateByUrl('ligas');
      },
      error: (err)=> alert(err.error.message || err.error)
    })
  }
}
