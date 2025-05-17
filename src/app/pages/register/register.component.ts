import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageDialogComponent } from '../../shared/message-dialog/message-dialog.component';
import { User } from '../../shared/models/user';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore} from '@angular/fire/firestore';
import { doc, setDoc } from '@angular/fire/firestore';

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
  isLoading = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  openDialog(): void {
    if(this.registerForm.valid){
      this.dialog.open(MessageDialogComponent);
    }
  }

  async register(): Promise<void> {
    this.signupError = '';

    if (this.registerForm.invalid) {
      this.signupError = 'Kérlek tölts ki minden mezőt megfelelően.';
      return;
    }

    const email = this.registerForm.get('email')!.value!;
    const password = this.registerForm.get('password')!.value!;
    const rePassword = this.registerForm.get('rePassword')!.value!;
    const firstname = this.registerForm.get('firstname')!.value!;
    const lastname = this.registerForm.get('lastname')!.value!;

    if (password !== rePassword) {
      this.signupError = 'A jelszavak nem egyeznek.';
      return;
    }

    this.isLoading = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const newUser: User = {
        id: userCredential.user.uid,
        firstname,
        lastname,
        email,
        password: '',
        role: 'user',
        propertiesForSell: [],
        selledProperties: []
      };

      const userDocRef = doc(this.firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, newUser);
      console.log('Felhasználó elmentve a Firestore-ba:', newUser);

      const dialogRef = this.dialog.open(MessageDialogComponent, {
        data: {
          title: 'Sikeres regisztráció!',
          message: 'Most már be tudsz jelentkezni.'
        }
      });

      setTimeout(() => {
        dialogRef.close();
        this.router.navigate(['/home']);
      }, 2000);

    } catch (err: any) {
      console.error('Hiba a regisztráció során:', err);
      this.signupError = err.message || 'Ismeretlen hiba történt.';
    } finally {
      this.isLoading = false;
    }
  }
}
