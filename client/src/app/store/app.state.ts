import { HistoryStateModel } from './history/history.model';
import { HistoryState } from './history/history.state';
import { LayoutStateModel } from './layout/layout.model';
import { LayoutState } from './layout/layout.state';
import { TodosSourceStateModel } from './todos-source/todos-source.model';
import { TodosSourceState } from './todos-source/todos-source.state';
import { TodosStateModel } from './todos/todos.model';
import { TodosState } from './todos/todos.state';
import { UserContextStateModel } from './user-context/user-context.model';
import { UserContextState } from './user-context/user-context.state';

export interface IAppState {
  layout: LayoutStateModel;
  todos: TodosStateModel;
  todosSource: TodosSourceStateModel;
  history: HistoryStateModel;
  userContext: UserContextStateModel;
}

export const appState = [
  LayoutState,
  TodosState,
  TodosSourceState,
  HistoryState,
  UserContextState,
];
