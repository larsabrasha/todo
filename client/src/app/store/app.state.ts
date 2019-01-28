import { HistoryStateModel } from './history/history.model';
import { HistoryState } from './history/history.state';
import { LayoutStateModel } from './layout/layout.model';
import { LayoutState } from './layout/layout.state';
import { TodosSourceStateModel } from './todos-source/todos-source.model';
import { TodosSourceState } from './todos-source/todos-source.state';
import { TodosStateModel } from './todos/todos.model';
import { TodosState } from './todos/todos.state';

export interface IAppState {
  layout: LayoutStateModel;
  todos: TodosStateModel;
  todosSource: TodosSourceStateModel;
  history: HistoryStateModel;
}

export const appState = [
  LayoutState,
  TodosState,
  TodosSourceState,
  HistoryState,
];
