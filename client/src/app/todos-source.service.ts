import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosSourceService {
  constructor(private httpClient: HttpClient) {}

  getSource(): Observable<string> {
    return this.httpClient.get('api/todos/source', { responseType: 'text' });
  }

  putSource(text: string): Observable<string> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain; charset=utf-8'
    );

    console.log('sparar: ', text);
    return this.httpClient.put('api/todos/source', text, {
      headers,
      responseType: 'text',
    });
  }
}
