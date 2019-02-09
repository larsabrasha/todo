import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourceEditorComponent } from './todos/source-editor/source-editor.component';
import { TodosComponent } from './todos/todos.component';
import { TokenGuard } from './token.guard';

const routes: Routes = [
  {
    path: 'todos',
    component: TodosComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'todos/source-editor',
    component: SourceEditorComponent,
    canActivate: [TokenGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
