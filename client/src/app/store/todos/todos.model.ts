import { Todo } from 'src/app/models/todo';

export class TodosStateModel {
  todos: Todo[];
}

export const defaults: TodosStateModel = {
  todos: [],
};
