import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private oktaAuth: OktaAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.oktaAuth.getAccessToken()).pipe(
      switchMap(accessToken => {
        const headers = req.headers
          .set('Authorization', 'Bearer ' + accessToken)
          .append('Content-Type', 'application/json');

        const requestClone = req.clone({
          headers,
        });
        return next.handle(requestClone);
      })
    );
  }
}
