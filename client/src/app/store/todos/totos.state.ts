import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodosService } from 'src/app/todos.service';
import { AddTodo, DeleteCompletedTodos, GetTodos, MoveTodo, ToggleChecked } from './todos.actions';
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
      tap(x =>
        context.patchState({
          todos: x,
        })
      )
    );
  }

  @Action(ToggleChecked)
  toggleChecked(context: StateContext<TodosStateModel>, action: ToggleChecked) {
    const state = context.getState();

    const updatedTodo = {
      ...state.todos[action.index],
      checked: !state.todos[action.index].checked,
    };

    const todos = [...state.todos];
    todos[action.index] = updatedTodo;

    context.patchState({
      todos: todos,
    });

    return this.todoService.putTodo(action.index, updatedTodo);
  }

  @Action(AddTodo)
  addTodo(context: StateContext<TodosStateModel>, action: AddTodo) {
    const state = context.getState();

    const newTodo = {
      title: action.title,
      checked: false,
    };

    const todos = [...state.todos, newTodo];
    context.patchState({
      todos: todos,
    });

    return this.todoService.postTodo(newTodo);
  }

  @Action(MoveTodo)
  moveTodo(context: StateContext<TodosStateModel>, action: MoveTodo) {
    const state = context.getState();

    const todos = [...state.todos];
    todos.splice(action.newIndex, 0, todos.splice(action.previousIndex, 1)[0]);

    context.patchState({
      todos: todos,
    });

    return this.todoService.moveTodo(action.previousIndex, action.newIndex);
  }

  @Action(DeleteCompletedTodos)
  deleteCompletedTodos(context: StateContext<TodosStateModel>) {
    return this.todoService.deleteCompletedTodos().pipe(
      tap(x =>
        context.patchState({
          todos: x,
        })
      )
    );
  }
}
