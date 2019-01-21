import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from './models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private httpClient: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>('api/todos');
  }

  postTodo(todo: Todo): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>('api/todos', todo);
  }

  putTodo(index: number, todo: Todo): Observable<Todo[]> {
    return this.httpClient.put<Todo[]>(`api/todos/${index}`, todo);
  }

  moveTodo(fromIndex: number, toIndex: number): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(`api/todos/move-todo?fromIndex=${fromIndex}&toIndex=${toIndex}`, '');
  }

  deleteCompletedTodos(): Observable<Todo[]> {
    return this.httpClient.post<Todo[]>(`api/todos/delete-completed`, {});
  }
}
