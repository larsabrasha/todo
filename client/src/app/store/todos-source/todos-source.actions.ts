export class GetTodosSource {
  static readonly type = '[Todos Source] Get Todos Source';
  constructor(public todoListId: string) {}
}

export class PutTodosSource {
  static readonly type = '[Todos Source] Put Todos Source';
  constructor(public todoListId: string, public source: string) {}
}
