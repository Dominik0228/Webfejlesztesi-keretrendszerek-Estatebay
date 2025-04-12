import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  
  signupError = '';

  constructor(private router: Router, public dialog: MatDialog) {}

  openDialog(): void {
    if(this.registerForm.valid){
      this.dialog.open(MessageDialogComponent);
    }
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.signupError = 'Please correct the form errors before submitting.';
      return;
    }

    const password = this.registerForm.get('password');
    const rePassword = this.registerForm.get('rePassword');

    if (password?.value !== rePassword?.value) {
      return;
    }

    const newUser: User = {
      firstname: this.registerForm.value.firstname || '',
      lastname: this.registerForm.value.lastname || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
      propertiesForSell: [],
      selledProperties: []
    };

    console.log('New user:', newUser);
    console.log('Form value:', this.registerForm.value);
  }
}
