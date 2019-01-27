import { Todo } from '../../models/todo';

export class TodoWasUpdatedPayload {
  todo: Todo;
  index: number;
}
