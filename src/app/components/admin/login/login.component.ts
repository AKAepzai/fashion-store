// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}
  onLogin(formData:any) {
       this.authService.login(formData.email, formData.password)
  }
  ngOnInit(): void {
      console.log('login:'+this.authService.isLoggedIn());
  }
}
