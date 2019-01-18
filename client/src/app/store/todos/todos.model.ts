import { Todo } from 'src/app/models/todo';

export class TodosStateModel {
  tempId: number;
  todoIds: number[];
  todos: { [id: number]: Todo };
}

export const defaults: TodosStateModel = {
  tempId: -1,
  todoIds: [],
  todos: {},
};
