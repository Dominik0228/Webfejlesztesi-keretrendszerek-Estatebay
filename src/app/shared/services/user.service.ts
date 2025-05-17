import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { User } from '../models/user';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  async addSoldProperty(userId: string, property: Property): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      throw new Error('User nem található');
    }

    const userData = userSnap.data() as User;

    const soldProperties = userData.selledProperties || [];

    soldProperties.push(property);

    await updateDoc(userDocRef, { selledProperties: soldProperties });
  }
}
