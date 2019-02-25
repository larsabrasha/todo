import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosSourceService {
  constructor(private httpClient: HttpClient) {}

  getSource(todoListId: string): Observable<string> {
    return this.httpClient.get(`api/todo-lists/${todoListId}/todos/source`, {
      responseType: 'text',
    });
  }

  putSource(todoListId: string, text: string): Observable<string> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );
    return this.httpClient.put(
      `api/todo-lists/${todoListId}/todos/source`,
      text,
      {
        headers,
        responseType: 'text',
      }
    );
  }
}
