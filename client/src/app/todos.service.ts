import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './models/todo';
import { TodoEvent } from './models/todo-event';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private httpClient: HttpClient) {}

  getTodos(
    todoListId: string,
    untilHistoryIndex: number = null
  ): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(
      `api/todo-lists/${todoListId}/todos${
        untilHistoryIndex != null
          ? '?untilHistoryIndex=' + untilHistoryIndex
          : ''
      }`
    );
  }

  postTodoFirst(todoListId: string, todo: Todo): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(
      `api/todo-lists/${todoListId}/todos?position=first`,
      todo
    );
  }

  postTodoLast(todoListId: string, todo: Todo): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(
      `api/todo-lists/${todoListId}/todos`,
      todo
    );
  }

  putTodo(todoListId: string, index: number, todo: Todo): Observable<Todo[]> {
    return this.httpClient.put<Todo[]>(
      `api/todo-lists/${todoListId}/todos/${index}`,
      todo
    );
  }

  moveTodo(
    todoListId: string,
    fromIndex: number,
    toIndex: number
  ): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(
      `api/todo-lists/${todoListId}/todos/move-todo?fromIndex=${fromIndex}&toIndex=${toIndex}`,
      ''
    );
  }

  deleteCompletedTodos(todoListId: string): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(
      `api/todo-lists/${todoListId}/todos/delete-completed`,
      {}
    );
  }

  getTodoEvents(todoListId: string): Observable<TodoEvent[]> {
    return this.httpClient.get<TodoEvent[]>(
      `api/todo-lists/${todoListId}/todos/todo-events`,
      {}
    );
  }
}
