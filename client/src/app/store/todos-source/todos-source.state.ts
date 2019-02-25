import { Action, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodosSourceService } from 'src/app/todos-source.service';
import { IAppState } from '../app.state';
import { GetTodosSource, PutTodosSource } from './todos-source.actions';
import { defaults, TodosSourceStateModel } from './todos-source.model';

@State<TodosSourceStateModel>({
  name: 'todosSource',
  defaults: defaults,
})
export class TodosSourceState {
  constructor(
    private todoSourceService: TodosSourceService,
    private store: Store
  ) {}

  @Action(GetTodosSource)
  getTodosSource(context: StateContext<TodosSourceStateModel>) {
    const todoListId = this.store.selectSnapshot(
      (state: IAppState) => state.todos.selectedTodoListId
    );

    return this.todoSourceService.getSource(todoListId).pipe(
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
    const todoListId = this.store.selectSnapshot(
      (state: IAppState) => state.todos.selectedTodoListId
    );

    return this.todoSourceService.putSource(todoListId, action.source).pipe(
      tap(x => {
        context.patchState({
          source: x,
        });
      })
    );
  }
}
