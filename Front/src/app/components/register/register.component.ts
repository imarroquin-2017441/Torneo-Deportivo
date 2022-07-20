import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: UserModel;
  confirmPass: String = '';
  timer: any;

  constructor(
    private userRest: UserRestService,
    private router: Router
  ) { 
    this.user = new UserModel('', '', '', '', '', 'CLIENT');
  }

  ngOnInit(): void {
  }

  async checkpassword(){
    clearTimeout(this.timer)
    this.timer = await setTimeout(()=>{
      if(this.user.password != ''){
        if(this.confirmPass != this.user.password){
          alert('Password no coinciden');
          clearTimeout(this.timer);
        }else{
          alert('Password coinciden');
          clearTimeout(this.timer);
        }
      }else{
        alert('Colocar una Password');
        clearTimeout(this.timer);
      }
    }, 1500)
  }

  register(registerForm: any){
    this.userRest.register(this.user).subscribe({
      next: (res:any)=>{
        alert(res.message);
        return this.router.navigateByUrl('/login')
      },
      error: (err)=>{
        registerForm.reset();
        return alert(err.error.message || err.error);
      }
    })
  }

}
