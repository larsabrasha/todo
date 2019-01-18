import { TodosStateModel } from './todos/todos.model';
import { TodosState } from './todos/totos.state';

export interface IAppState {
  todos: TodosStateModel;
}

export const appState = [TodosState];
