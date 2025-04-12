import { Component } from '@angular/core';
import { ExistingProfile } from '../../shared/existingProfiles';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  existingProfile = ExistingProfile;

  userIndex: Number = 0;

  loginForm: FormGroup;
  invalidUserMessage: string = 'Wrong Email or Password!';
  errorMessage: string = ''; 
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      for(let i = 0; i < this.existingProfile.length; i++){
        if(this.loginForm.controls['email'].value == this.existingProfile[i].email 
        && this.loginForm.controls['password'].value == this.existingProfile[i].password){
          this.userIndex = i;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', i.toString());
          window.location.href = '/home';
        }
      }
      if(localStorage.getItem('isLoggedIn') == 'false'){
        alert(this.invalidUserMessage);
      }
    } else {
      alert("The form has invalid input!");
    }
  }
}
