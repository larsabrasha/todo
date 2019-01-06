import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OktaAuthModule } from '@okta/okta-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';

const oktaConfig = {
  issuer: 'https://dev-864778.oktapreview.com/oauth2/default',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oahkwubz9Vyq8CPj0h7',
};

@NgModule({
  declarations: [AppComponent, ProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OktaAuthModule.initAuth(oktaConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
