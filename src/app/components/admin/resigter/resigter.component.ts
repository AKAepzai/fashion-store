import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-resigter',
  templateUrl: './resigter.component.html',
  styleUrl: './resigter.component.css'
})
export class ResigterComponent {
  constructor(private authService: AuthService) {}

  onRegister(formData: any) {
    this.authService.register(formData.username, formData.email, formData.password, formData.confirmPassword);
  }
}
