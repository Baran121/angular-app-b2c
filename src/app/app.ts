import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicClientApplication } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('simple-app');

  private msalInstance = new PublicClientApplication({
    auth: {
      authority: 'https://login.microsoftonline.com/a083acb1-aba6-472c-8701-d8fa2739ff40',
      clientId: 'c0bfa58e-6b6d-4949-99b1-a90c8d06deab',
      knownAuthorities: ['https://login.microsoftonline.com/a083acb1-aba6-472c-8701-d8fa2739ff40'],
      // postLogoutRedirectUri: '/',
      redirectUri: "http://localhost:4200/"
    },
    cache: {
      cacheLocation: "memoryStorage",
      storeAuthStateInCookie: true
    }
  });

  constructor() {
    this.msalInstance.initialize();
  }

  async login() {
    await this.msalInstance.initialize();
    this.msalInstance.loginRedirect();
  }

  checkUserLoginClick() {
    // Use type assertion for window and access with ['checkUserLogin']
    const win = window as { [key: string]: any };
    if (typeof win['checkUserLogin'] === 'function') {
      win['checkUserLogin']();
    } else {
      alert('checkUserLogin JS function is not loaded!');
    }
  }
}
