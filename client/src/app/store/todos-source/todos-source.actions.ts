export class GetTodosSource {
  static readonly type = '[Todos Source] Get Todos Source';
}

export class PutTodosSource {
  static readonly type = '[Todos Source] Put Todos Source';
  constructor(public source: string) {}
}
