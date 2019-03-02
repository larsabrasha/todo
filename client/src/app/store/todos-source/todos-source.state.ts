import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodosSourceService } from 'src/app/todos-source.service';
import { GetTodosSource, PutTodosSource } from './todos-source.actions';
import { defaults, TodosSourceStateModel } from './todos-source.model';

@State<TodosSourceStateModel>({
  name: 'todosSource',
  defaults: defaults,
})
export class TodosSourceState {
  constructor(private todoSourceService: TodosSourceService) {}

  @Action(GetTodosSource)
  getTodosSource(
    context: StateContext<TodosSourceStateModel>,
    action: GetTodosSource
  ) {
    return this.todoSourceService.getSource(action.todoListId).pipe(
      tap(x => {
        context.patchState({
          source: x,
        });
      })
    );
  }

  @Action(PutTodosSource)
  putTodosSource(
    context: StateContext<TodosSourceStateModel>,
    action: PutTodosSource
  ) {
    return this.todoSourceService
      .putSource(action.todoListId, action.source)
      .pipe(
        tap(x => {
          context.patchState({
            source: x,
          });
        })
      );
  }
}
