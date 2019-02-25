import { Injectable, Logger } from '@nestjs/common';
import * as eventStream from 'event-stream';
import * as fs from 'fs';
import * as path from 'path';
import { SourceWasUpdatedPayload } from '../models/payloads/source-was-updated-payload';
import { TodoWasAddedPayload } from '../models/payloads/todo-was-added-payload';
import { TodoWasMovedPayload } from '../models/payloads/todo-was-moved-payload';
import { TodoWasUpdatedPayload } from '../models/payloads/todo-was-updated-payload';
import { Todo } from '../models/todo';
import { TodoEvent } from '../models/todo-event';
import { TodoEventType } from '../models/toto-event-type';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  regex = /(x)?\s?(\([A-Z]\))?\s?(\d{4}\-\d{2}\-\d{2})?\s?(\d{4}\-\d{2}\-\d{2})?\s?(.*)/;

  getSourceFilePath(todoListId: string) {
    return this.getAbsoluteFilePath(`./data/${todoListId}/todo.txt`);
  }

  getEventSourceFilePath(todoListId: string) {
    return this.getAbsoluteFilePath(`./data/${todoListId}/todo-events.txt`);
  }

  handleTodoEvent(todoListId: string, todoEvent: TodoEvent): Todo[] {
    const todoEventAsJson = JSON.stringify(todoEvent);

    const filePath = this.getEventSourceFilePath(todoListId);
    this.ensureDirectoryExistence(filePath);

    fs.appendFileSync(filePath, todoEventAsJson + '\n', 'UTF-8');

    const todos = this.applyTodoEvent(todoEvent, this.getTodos(todoListId));

    if (typeof todos === 'string') {
      this.saveTodosFromString(todoListId, todos);
    } else {
      this.saveTodos(todoListId, todos);
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

  getTodoEvents(todoListId: string): Promise<TodoEvent[]> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.getEventSourceFilePath(todoListId)) === false) {
        resolve([]);
        return;
      }

      const todoEvents = [];

      const stream = fs
        .createReadStream(this.getEventSourceFilePath(todoListId))
        .pipe(eventStream.split())
        .pipe(
          eventStream
            .mapSync(line => {
              stream.pause();

              const todoEventAsString = line.trim();
              if (todoEventAsString !== '') {
                const todoEvent = JSON.parse(todoEventAsString);
                todoEvents.push(todoEvent);
              }

              stream.resume();
            })
            .on('error', err => {
              reject(err);
            })
            .on('end', () => {
              resolve(todoEvents);
            })
        );
    });
  }

  getTodosFromEvents(): Promise<Todo[]> {
    return this.getTodosFromEventsUntilIndex(null);
  }

  getTodosFromEventsUntilIndex(
    todoListId: string,
    index: number = null
  ): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      let lineIndex = 0;

      let todos = [];

      const stream = fs
        .createReadStream(this.getEventSourceFilePath(todoListId))
        .pipe(eventStream.split())
        .pipe(
          eventStream
            .mapSync(line => {
              if (index != null && lineIndex > index) {
                stream.end();
              }

              stream.pause();

              const todoEventAsString = line.trim();
              if (todoEventAsString !== '') {
                const todoEvent = JSON.parse(todoEventAsString);
                todos = this.applyTodoEvent(todoEvent, todos);
              }

              lineIndex += 1;

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

  getTodos(todoListId: string) {
    const source = this.getTodosAsString(todoListId);
    return source != null ? this.parseSource(source) : [];
  }

  getTodosAsString(todoListId: string): string {
    return fs.existsSync(this.getEventSourceFilePath(todoListId))
      ? this.readFileAsString(this.getSourceFilePath(todoListId))
      : null;
  }

  saveTodos(todoListId: string, todos: Todo[]) {
    const source = this.convertToSource(todos);
    this.saveTodosFromString(todoListId, source);
  }

  saveTodosFromString(todoListId: string, text: string) {
    const filePath = this.getSourceFilePath(todoListId);
    this.ensureDirectoryExistence(filePath);
    fs.writeFileSync(filePath, text, 'utf8');
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
