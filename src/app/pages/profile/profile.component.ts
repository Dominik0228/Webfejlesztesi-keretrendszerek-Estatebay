import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExistingProfile } from '../../shared/existingProfiles';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  existingProfile = ExistingProfile;

  userId = 0;

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
  }
}
