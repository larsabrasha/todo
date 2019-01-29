export class LoadTodos {
  static readonly type = '[Todos] Load Todos';
}

export class ToggleChecked {
  static readonly type = '[Todos] Toggle Checked';
  constructor(public index: number) {}
}

export class AddTodo {
  static readonly type = '[Todos] Add Todo';
  constructor(public title: string) {}
}

export class DeleteCompletedTodos {
  static readonly type = '[Todos] Delete Completed Todos';
}

export class MoveTodo {
  static readonly type = '[Todos] Move Todo';
  constructor(public previousIndex: number, public newIndex: number) {}
}

export class ShowTodosAtHistoryIndex {
  static readonly type = '[Todos] Show Todos At History Index';
  constructor(public historyIndex: number) {}
}
