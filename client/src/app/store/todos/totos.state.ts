import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodosService } from 'src/app/todos.service';
import { AddTodo, GetTodos, ToggleChecked } from './todos.actions';
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

  @Action(AddTodo)
  addTodo(context: StateContext<TodosStateModel>, action: AddTodo) {
    const state = context.getState();

    const tempId = state.tempId - 1;

    context.patchState({
      tempId,
      todoIds: [...state.todoIds, tempId],
      todos: {
        ...state.todos,
        [tempId]: {
          id: tempId,
          title: action.title,
          checked: false,
        },
      },
    });

    return this.todoService
      .postTodo({
        id: 0,
        title: action.title,
        checked: false,
      })
      .pipe(
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
}
