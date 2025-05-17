import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Property } from '../models/property';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private firestore: Firestore) {}

  getAll(): Observable<Property[]> {
    const propertyRef = collection(this.firestore, 'properties');
    return collectionData(propertyRef, { idField: 'id' }) as Observable<Property[]>;
  }

  async create(property: Omit<Property, 'id'>): Promise<void> {
    const propertyRef = collection(this.firestore, 'properties');
    await addDoc(propertyRef, property);
  }

  async update(property: Property): Promise<void> {
    const propertyDoc = doc(this.firestore, `properties/${property.id}`);
    await updateDoc(propertyDoc, { ...property });
  }

  async delete(id: string): Promise<void> {
    const propertyDoc = doc(this.firestore, `properties/${id}`);
    await deleteDoc(propertyDoc);
  }

  async addSoldPropertyToUser(userId: string, property: Property): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as any;
      const selledProperties = userData.selledProperties || [];
      selledProperties.push(property);
      await updateDoc(userDocRef, { selledProperties });
    } else {
      throw new Error('User not found');
    }
  }
}
