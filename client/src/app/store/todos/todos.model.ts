import { Todo } from 'src/app/models/todo';
import { TodoList } from 'src/app/models/todo-list';

export class TodosStateModel {
  todoLists: TodoList[];
  selectedTodoListId: string;
  selectedTodoListName: string;
  todos: Todo[];
  showingTodosAtHistoryIndex: number;
}

export const defaults: TodosStateModel = {
  todoLists: [],
  selectedTodoListId: null,
  selectedTodoListName: null,
  todos: [],
  showingTodosAtHistoryIndex: null,
};
