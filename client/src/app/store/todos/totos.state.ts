import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Todo } from 'src/app/models/todo';
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
    return this.todoService
      .getTodos()
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  @Action(ToggleChecked)
  toggleChecked(context: StateContext<TodosStateModel>, action: ToggleChecked) {
    const state = context.getState();

    const updatedTodo = {
      ...state.todos[action.todo.index],
      checked: !state.todos[action.todo.index].checked,
    };

    return this.todoService
      .putTodo(action.todo.index, updatedTodo)
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  @Action(AddTodo)
  addTodo(context: StateContext<TodosStateModel>, action: AddTodo) {
    return this.todoService
      .postTodo({
        index: null,
        title: action.title,
        checked: false,
      })
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  @Action(MoveTodo)
  moveTodo(context: StateContext<TodosStateModel>, action: MoveTodo) {
    const state = context.getState();

    const todo = {
      ...state.todos[action.previousIndex],
      index: action.newIndex,
    };

    return this.todoService
      .putTodo(action.previousIndex, todo)
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }

  mapTodos(todos: Todo[]) {
    return {
      todoIds: todos.map(x => x.index),
      todos: todos.reduce((prev, cur) => {
        prev[cur.index] = cur;
        return prev;
      }, {}),
    };
  }

  @Action(DeleteCompletedTodos)
  deleteCompletedTodos(context: StateContext<TodosStateModel>) {
    return this.todoService
      .deleteCompletedTodos()
      .pipe(tap(x => context.patchState(this.mapTodos(x))));
  }
}
