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

  getTodos(untilHistoryIndex: number = null): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(
      'api/todos' +
        (untilHistoryIndex != null
          ? '?untilHistoryIndex=' + untilHistoryIndex
          : '')
    );
  }

  postTodo(todo: Todo): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>('api/todos', todo);
  }

  putTodo(index: number, todo: Todo): Observable<Todo[]> {
    return this.httpClient.put<Todo[]>(`api/todos/${index}`, todo);
  }

  moveTodo(fromIndex: number, toIndex: number): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(
      `api/todos/move-todo?fromIndex=${fromIndex}&toIndex=${toIndex}`,
      ''
    );
  }

  deleteCompletedTodos(): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(`api/todos/delete-completed`, {});
  }

  getTodoEvents(): Observable<TodoEvent[]> {
    return this.httpClient.get<TodoEvent[]>(`api/todos/todo-events`, {});
  }
}
