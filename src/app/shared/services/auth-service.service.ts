import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
  console.log('AuthService inicializálódott');
  onAuthStateChanged(this.auth, async (user: FirebaseUser | null) => {

  console.log('Auth state changed:', user);
  if (user) {
    try {
      console.log('User is logged in:', user.uid);
      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        this.currentUserSubject.next(userData);
        console.log('Login successful');
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        this.currentUserSubject.next(null);
        console.log('Login unsuccessful - userDoc not exists');
        localStorage.removeItem('isLoggedIn');
      }
    } catch (error) {
      console.error('Error fetching user doc:', error);
      this.currentUserSubject.next(null);
      localStorage.removeItem('isLoggedIn');
    }
  } else {
    this.currentUserSubject.next(null);
    console.log('Login unsuccessful - no user');
    localStorage.removeItem('isLoggedIn');
  }
});

}


  async isAdmin(): Promise<boolean> {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUserId(): string | null {
    return this.currentUserSubject.value?.id || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.auth.signOut();
    this.currentUserSubject.next(null);
    localStorage.removeItem('isLoggedIn');
  }
}