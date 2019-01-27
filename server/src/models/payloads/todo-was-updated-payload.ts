import { Todo } from 'dist/models/todo';

export class TodoWasUpdatedPayload {
  todo: Todo;
  index: number;
}
