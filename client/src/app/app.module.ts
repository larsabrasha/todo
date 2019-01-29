import { DragDropModule } from '@angular/cdk/drag-drop';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeSv from '@angular/common/locales/sv';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { OktaAuthModule } from '@okta/okta-angular';
import { GravatarModule } from 'ngx-gravatar';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { ProfileComponent } from './profile/profile.component';
import { appState } from './store/app.state';
import { HistorySliderComponent } from './todos/history-slider/history-slider.component';
import { SourceEditorComponent } from './todos/source-editor/source-editor.component';
import { TodosComponent } from './todos/todos.component';

registerLocaleData(localeSv, 'sv');

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    TodosComponent,
    SourceEditorComponent,
    HistorySliderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    OktaAuthModule.initAuth(environment.oktaConfig),
    NgxsModule.forRoot(appState, {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    GravatarModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'sv' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
