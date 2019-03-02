export class LoadTodoLists {
  static readonly type = '[Todos] Load Todo Lists';
  constructor(public selectedTodoListId: string) {}
}

export class SelectTodoList {
  static readonly type = '[Todos] Select Todo List';
  constructor(public id: string) {}
}

export class DeleteSelectedTodoList {
  static readonly type = '[Todos] Delete Selected Todo List';
}

export class CreateTodoList {
  static readonly type = '[Todos] Create Todo List';
  constructor(public name: string) {}
}

export class UpdateSelectedTodoListName {
  static readonly type = '[Todos] Edit Selected Todo List Name';
  constructor(public name: string) {}
}

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
  constructor() {}
}

export class MoveTodo {
  static readonly type = '[Todos] Move Todo';
  constructor(public previousIndex: number, public newIndex: number) {}
}

export class ShowTodosAtHistoryIndex {
  static readonly type = '[Todos] Show Todos At History Index';
  constructor(public historyIndex: number) {}
}
