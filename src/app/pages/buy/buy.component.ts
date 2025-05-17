import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { PropertyService } from '../../shared/services/property.service';
import { Property } from '../../shared/models/property';
import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/auth-service.service';
import { firstValueFrom } from 'rxjs';
import { doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent, MatCardTitle],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss'
})
export class BuyComponent implements OnInit {
  properties: Property[] = [];
  currentUser: User | null = null;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    await this.loadProperties();
  }

  async loadProperties(): Promise<void> {
    try {
      const data = await firstValueFrom(this.propertyService.getAll());
      this.properties = data;
    } catch (error) {
      console.error('Hiba a property-k betöltésekor:', error);
    }
  }

  async buyProperty(property: Property): Promise<void> {
  if (!this.currentUser) {
    alert('Nem vagy bejelentkezve!');
    return;
  }

  try {
    await this.propertyService.delete(property.id);

    if (property.seller) {
      await this.propertyService.addSoldPropertyToUser(property.userId, property);
    }
    console.log(property.seller, property)

    alert('Sikeres vásárlás!');
    await this.loadProperties();
  } catch (error) {
    console.error('Hiba a vásárlás során:', error);
    alert('Hiba történt a vásárlás során!');
  }
}
}