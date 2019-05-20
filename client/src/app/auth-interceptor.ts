import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, skip, switchMap, take } from 'rxjs/operators';
import { IAppState } from './store/app.state';
import {
  UpdateToken,
  UserDidLogout,
} from './store/user-context/user-context.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @Select((state: IAppState) => state.userContext.token)
  tokenSub$: Observable<string>;

  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(
      (state: IAppState) => state.userContext.token
    );
    return next
      .handle(this.applyToken(req, token))
      .pipe(catchError(error => this.handleError(error, next, req)));
  }

  private applyToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      headers: request.headers
        .set('Authorization', 'Bearer ' + token)
        .append('Content-Type', 'application/json'),
    });
  }

  private handleError(
    error: HttpErrorResponse,
    next: HttpHandler,
    req: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );

      if (error.status === 401) {
        this.store.dispatch(new UpdateToken());

        return this.tokenSub$.pipe(
          skip(1),
          take(1),
          switchMap(() => {
            const token = this.store.selectSnapshot(
              (state: IAppState) => state.userContext.token
            );
            return next.handle(this.applyToken(req, token));
          }),
          catchError(() => {
            this.store.dispatch(new UserDidLogout());
            return new Observable<HttpEvent<any>>();
          })
        );
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    }
  }
}
