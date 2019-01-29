import { TodoEvent } from 'src/app/models/todo-event';

export class HistoryStateModel {
  todoEvents: TodoEvent[];
  maxHistoryIndex: number;
}

export const defaults: HistoryStateModel = {
  todoEvents: [],
  maxHistoryIndex: 0,
};
