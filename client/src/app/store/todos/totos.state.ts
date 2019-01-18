import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodosService } from 'src/app/todos.service';
import { GetTodos, ToggleChecked } from './todos.actions';
import { defaults, TodosStateModel } from './todos.model';

@State<TodosStateModel>({
  name: 'todos',
  defaults: defaults,
})
export class TodosState {
  constructor(private todoService: TodosService) {}

  @Action(GetTodos)
  getTodos(context: StateContext<TodosStateModel>) {
    return this.todoService.getTodos().pipe(
      tap(todos => {
        context.patchState({
          todoIds: todos.map(x => x.id),
          todos: todos.reduce((prev, cur) => {
            prev[cur.id] = cur;
            return prev;
          }, {}),
        });
      })
    );
  }

  @Action(ToggleChecked)
  toggleChecked(context: StateContext<TodosStateModel>, action: ToggleChecked) {
    const state = context.getState();

    context.patchState({
      todos: {
        ...state.todos,
        [action.todo.id]: {
          ...state.todos[action.todo.id],
          checked: !state.todos[action.todo.id].checked,
        },
      },
    });
  }
}
