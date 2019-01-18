import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { ProfileComponent } from './profile/profile.component';
import { SourceEditorComponent } from './todos/source-editor/source-editor.component';
import { TodosComponent } from './todos/todos.component';

const routes: Routes = [
  {
    path: 'implicit/callback',
    component: OktaCallbackComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'todos',
    component: TodosComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'todos/source-editor',
    component: SourceEditorComponent,
    canActivate: [OktaAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
