import { Injectable, Logger } from '@nestjs/common';
import * as eventStream from 'event-stream';
import * as fs from 'fs';
import * as path from 'path';
import { SourceWasUpdatedPayload } from 'src/models/payloads/source-was-updated-payload';
import { TodoWasAddedPayload } from 'src/models/payloads/todo-was-added-payload';
import { TodoWasMovedPayload } from 'src/models/payloads/todo-was-moved-payload';
import { TodoWasUpdatedPayload } from 'src/models/payloads/todo-was-updated-payload';
import { TodoEvent } from 'src/models/todo-event';
import { TodoEventType } from 'src/models/toto-event-type';
import { Todo } from '../models/todo';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  sourceFilePath: string;
  eventSourceFilePath: string;
  regex = /(x)?\s?(\([A-Z]\))?\s?(\d{4}\-\d{2}\-\d{2})?\s?(\d{4}\-\d{2}\-\d{2})?\s?(.*)/;

  constructor() {
    this.sourceFilePath = this.getAbsoluteFilePath('./data/todo.txt');
    this.ensureDirectoryExistence(this.sourceFilePath);

    this.eventSourceFilePath = this.getAbsoluteFilePath(
      './data/todo-events.txt'
    );
    this.ensureDirectoryExistence(this.eventSourceFilePath);
  }

  handleTodoEvent(todoEvent: TodoEvent): Todo[] {
    const todoEventAsJson = JSON.stringify(todoEvent);
    fs.appendFileSync(
      this.eventSourceFilePath,
      todoEventAsJson + '\n',
      'UTF-8'
    );

    const todos = this.applyTodoEvent(todoEvent, this.getTodos());

    if (typeof todos === 'string') {
      this.saveTodosFromString(todos);
    } else {
      this.saveTodos(todos);
    }

    return todos;
  }

  applyTodoEvent(todoEvent: TodoEvent, todos: Todo[]): Todo[] {
    switch (todoEvent.type) {
      case TodoEventType.TodoWasAdded: {
        const payload = todoEvent.payload as TodoWasAddedPayload;
        return this.applyAddTodo(payload.todo, todos);
      }
      case TodoEventType.TodoWasUpdated: {
        const payload = todoEvent.payload as TodoWasUpdatedPayload;
        return this.applyUpdateTodo(payload.todo, payload.index, todos);
      }
      case TodoEventType.TodoWasMoved: {
        const payload = todoEvent.payload as TodoWasMovedPayload;
        return this.applyMoveTodo(payload.fromIndex, payload.toIndex, todos);
      }
      case TodoEventType.CompletedTodosWasDeleted: {
        return this.applyDeleteCompletedTodos(todos);
      }
      case TodoEventType.SourceWasUpdated: {
        const payload = todoEvent.payload as SourceWasUpdatedPayload;
        return this.parseSource(payload.text);
      }
      default:
        return todos;
    }
  }

  applyAddTodo(todo: Todo, todos: Todo[]): Todo[] {
    return [...todos, todo];
  }

  applyUpdateTodo(todo: Todo, index: number, todos: Todo[]): Todo[] {
    const newTodos = [...todos];
    newTodos[index] = todo;
    return newTodos;
  }

  applyMoveTodo(fromIndex: number, toIndex: number, todos: Todo[]): Todo[] {
    const newTodos = [...todos];
    newTodos.splice(toIndex, 0, newTodos.splice(fromIndex, 1)[0]);
    return newTodos;
  }

  applyDeleteCompletedTodos(todos: Todo[]): Todo[] {
    return todos.filter(x => !x.checked);
  }

  getTodos2(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      let lineNr = 0;

      let todos = [];

      const stream = fs
        .createReadStream(this.eventSourceFilePath)
        .pipe(eventStream.split())
        .pipe(
          eventStream
            .mapSync(line => {
              stream.pause();

              lineNr += 1;

              const todoEventAsString = line.trim();
              if (todoEventAsString !== '') {
                const todoEvent = JSON.parse(todoEventAsString);
                todos = this.applyTodoEvent(todoEvent, todos);
              }

              stream.resume();
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => {
              this.logger.log(JSON.stringify(todos));
              resolve(todos);
            })
        );
    });
  }

  getTodos() {
    const source = this.getTodosAsString();
    return source != null ? this.parseSource(source) : [];
  }

  getTodosAsString(): string {
    return this.readFileAsString(this.sourceFilePath);
  }

  saveTodos(todos: Todo[]) {
    const source = this.convertToSource(todos);
    this.saveTodosFromString(source);
  }

  saveTodosFromString(text: string) {
    this.ensureDirectoryExistence(this.sourceFilePath);
    fs.writeFileSync(this.sourceFilePath, text, 'utf8');
  }

  parseSource(source: string): Todo[] {
    if (source.trim() === '') {
      return [];
    }

    const sourceRows = source.trim().split('\n');

    return sourceRows
      .map((x, index) => {
        const m = this.regex.exec(x.trim());
        return m !== null
          ? {
              index,
              title: m[5],
              checked: m[1] === 'x' ? true : false,
            }
          : null;
      })
      .filter(x => x != null);
  }

  convertToSource(todos: Todo[]): string {
    return todos
      .map(todo => `${todo.checked ? 'x ' : ''}${todo.title}`)
      .join('\n');
  }

  readFileAsString(filePath: string) {
    return fs.existsSync(filePath)
      ? fs.readFileSync(filePath).toString()
      : null;
  }

  ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  getAbsoluteFilePath(sourceFilePath: string) {
    return sourceFilePath.startsWith('.')
      ? path.join(__dirname, '../../', sourceFilePath)
      : sourceFilePath;
  }
}
