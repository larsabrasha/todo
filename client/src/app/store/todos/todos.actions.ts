import { Todo } from 'src/app/models/todo';

export class GetTodos {
  static readonly type = '[Todos] Get Todos';
}

export class ToggleChecked {
  static readonly type = '[Todos] Toggle Checked';
  constructor(public todo: Todo) {}
}
