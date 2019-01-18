import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { OktaAuthModule } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { ProfileComponent } from './profile/profile.component';
import { appState } from './store/app.state';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  declarations: [AppComponent, ProfileComponent, TodosComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OktaAuthModule.initAuth(environment.oktaConfig),
    NgxsModule.forRoot(appState, {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
