import { TodoEvent } from 'src/app/models/todo-event';

export class HistoryStateModel {
  todoEvents: TodoEvent[];
}

export const defaults: HistoryStateModel = {
  todoEvents: [],
};
