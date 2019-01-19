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

  putTodo(todo: Todo): Observable<Todo[]> {
    return this.httpClient.put<Todo[]>(`api/todos/${todo.id}`, todo);
  }
}
