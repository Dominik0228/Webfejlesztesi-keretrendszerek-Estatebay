import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Kérlek töltsd ki a mezőket helyesen.';
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userCredential.user.uid);

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = 'Hibás email vagy jelszó!';
    } finally {
      this.isLoading = false;
    }
  }
}