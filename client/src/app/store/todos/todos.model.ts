import { Todo } from 'src/app/models/todo';

export class TodosStateModel {
  todoIds: number[];
  todos: { [id: number]: Todo };
}

export const defaults: TodosStateModel = {
  todoIds: [],
  todos: {},
};
