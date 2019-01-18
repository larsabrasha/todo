import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  authenticationStateSub: Subscription;

  constructor(public oktaAuth: OktaAuthService, private router: Router) {
    // Subscribe to authentication state changes
    this.authenticationStateSub = this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  async ngOnInit() {
    // Get the authentication state for immediate use
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    if (this.isAuthenticated) {
      this.router.navigate(['/todos']);
    }
  }

  ngOnDestroy() {
    this.authenticationStateSub.unsubscribe();
  }

  login() {
    this.oktaAuth.loginRedirect('/todos');
  }

  logout() {
    this.oktaAuth.logout('/');
  }
}
