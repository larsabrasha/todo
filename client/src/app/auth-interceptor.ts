import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAppState } from './store/app.state';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(
      (state: IAppState) => state.userContext.token
    );

    const headers = req.headers
      .set('Authorization', 'Bearer ' + token)
      .append('Content-Type', 'application/json');

    const requestClone = req.clone({
      headers,
    });

    return next.handle(requestClone);
  }
}
