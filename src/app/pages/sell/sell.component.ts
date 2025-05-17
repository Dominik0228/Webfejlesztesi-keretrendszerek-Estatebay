import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../shared/models/property';
import { PropertyService } from '../../shared/services/property.service';
import { AuthService } from '../../shared/services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SellComponent implements OnInit {
  properties: Property[] = [];
  currentUser: User | null = null;
  selectedFile: File | null = null;
  imageUrl: string = '';
  fileUploadError: string = '';

  newProperty: Partial<Property> = {
    name: '',
    size: 0,
    location: '',
    price: 0,
    seller: '',
    description: ''
  };

  constructor(
    private propertyService: PropertyService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadProperties();
    });
  }

  loadProperties(): void {
    this.propertyService.getAll().subscribe(properties => {
      const safeProperties = properties ?? [];

      if (this.currentUser?.role === 'admin') {
        this.properties = safeProperties;
      } else {
        this.properties = safeProperties.filter(
          p => p.userId === this.currentUser?.id
        );
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) {
      return null;
    }

    try {
      const storage = getStorage();
      const filePath = `property-images/${uuidv4()}_${this.selectedFile.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, this.selectedFile);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Hiba a kép feltöltésekor:', error);
      this.fileUploadError = 'Hiba történt a kép feltöltése során.';
      return null;
    }
  }

  async addProperty(): Promise<void> {
    if (!this.currentUser || !this.newProperty.name || !this.newProperty.location) {
      return;
    }

    const uploadedImageUrl = await this.uploadImage();

    const property: Omit<Property, 'id'> = {
      name: this.newProperty.name!,
      location: this.newProperty.location!,
      size: Number(this.newProperty.size),
      price: Number(this.newProperty.price),
      seller: this.currentUser.lastname || 'Ismeretlen',
      userId: this.currentUser.id,
      description: this.newProperty.description || '',
      imageUrl: uploadedImageUrl || ''
    };

    try {
      await this.propertyService.create(property);
      this.loadProperties();
      this.newProperty = {};
      this.selectedFile = null;
      this.fileUploadError = '';
    } catch (err) {
      console.error('Hiba a property létrehozásakor:', err);
    }
  }

  async deleteProperty(propertyId: string): Promise<void> {
    try {
      await this.propertyService.delete(propertyId);
      this.loadProperties();
    } catch (err) {
      console.error('Hiba a property törlésekor:', err);
    }
  }
}
