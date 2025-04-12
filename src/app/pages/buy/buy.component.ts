import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { constantProperties } from '../../shared/models/constantProperties';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-buy',
  imports: [
    CommonModule,
    MatCard, 
    MatCardContent, 
    MatCardTitle],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss'
})
export class BuyComponent {
  constantProperties = constantProperties;
}
