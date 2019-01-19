import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Todo } from 'src/app/models/todo';
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
    return this.todoService
      .getTodos()
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  @Action(ToggleChecked)
  toggleChecked(context: StateContext<TodosStateModel>, action: ToggleChecked) {
    const state = context.getState();

    const updatedTodo = {
      ...state.todos[action.todo.id],
      checked: !state.todos[action.todo.id].checked,
    };

    context.patchState({
      todos: {
        ...state.todos,
        [action.todo.id]: updatedTodo,
      },
    });

    return this.todoService
      .putTodo(updatedTodo)
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
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
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  mapTodos(todos: Todo[]) {
    return {
      todoIds: todos.map(x => x.id),
      todos: todos.reduce((prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {}),
    };
  }
}
