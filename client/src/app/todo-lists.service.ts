import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList } from './models/todo-list';

@Injectable({
  providedIn: 'root',
})
export class TodoListsService {
  constructor(private httpClient: HttpClient) {}

  get(): Observable<TodoList[]> {
    return this.httpClient.get<TodoList[]>('api/todo-lists');
  }

  post(todoList: TodoList): Observable<TodoList[]> {
    return this.httpClient.post<TodoList[]>('api/todo-lists', todoList);
  }

  put(todoList: TodoList): Observable<TodoList[]> {
    return this.httpClient.put<TodoList[]>(
      `api/todo-lists/${todoList.id}`,
      todoList
    );
  }

  delete(todoListId: string): Observable<TodoList[]> {
    return this.httpClient.delete<TodoList[]>(`api/todo-lists/${todoListId}`);
  }
}
