import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-message-dialog',
  imports: [MatCard],
  template: `
   <mat-card class="message-container">
    <div class="message-text">
        <p class="header-description">Register was successful!</p>
    </div>
  </mat-card>
  `,
  styleUrl: './message-dialog.component.scss'
})
export class MessageDialogComponent {

}
