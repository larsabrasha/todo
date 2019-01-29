import { Todo } from 'src/app/models/todo';

export class TodosStateModel {
  todos: Todo[];
  showingTodosAtHistoryIndex: number;
}

export const defaults: TodosStateModel = {
  todos: [],
  showingTodosAtHistoryIndex: null,
};
