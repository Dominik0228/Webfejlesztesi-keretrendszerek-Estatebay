import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), 
    provideFirebaseApp(() =>
      initializeApp({
        projectId: "estatebay-769ef",
        appId: "1:897989146446:web:affd83ea639016a2bf501f",
        storageBucket: "estatebay-769ef.firebasestorage.app",
        apiKey: "AIzaSyD0MRQHEH86KzIk7N1xoVecCw80CLnWRrU",
        authDomain: "estatebay-769ef.firebaseapp.com",
        messagingSenderId: "897989146446",
        measurementId: "G-WMYFQV2JL5"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
