import { TodosSourceStateModel } from './todos-source/todos-source.model';
import { TodosSourceState } from './todos-source/todos-source.state';
import { TodosStateModel } from './todos/todos.model';
import { TodosState } from './todos/totos.state';

export interface IAppState {
  todos: TodosStateModel;
  todosSource: TodosSourceStateModel;
}

export const appState = [TodosState, TodosSourceState];
