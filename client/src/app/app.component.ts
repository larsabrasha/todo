import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { IAppState } from './store/app.state';
import {
  TokenWasUpdated,
  UpdateToken,
  UserDidLogout,
} from './store/user-context/user-context.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  ssoConfig = environment.ssoConfig;

  @ViewChild('sso', { static: true })
  sso: ElementRef;

  isAuthenticated: boolean | null;
  isAuthenticatedSub: Subscription;

  updateTokenTimestampSub: Subscription;

  trustedSsoIframeUrl: SafeUrl;

  @Select((state: IAppState) => state.userContext.email)
  email$: Observable<string>;

  @Select((state: IAppState) => state.userContext.name)
  name$: Observable<string>;

  @HostListener('window:message', ['$event'])
  onWindowMessage(event: any) {
    this.handleWindowMessage(event);
  }

  constructor(
    private store: Store,
    sanitizer: DomSanitizer,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.trustedSsoIframeUrl = sanitizer.bypassSecurityTrustResourceUrl(
      this.ssoConfig.iframeUrl
    );
  }

  ngOnInit() {
    this.isAuthenticatedSub = this.store
      .select((state: IAppState) => state.userContext.isAuthenticated)
      .subscribe(x => {
        this.isAuthenticated = x;

        console.log('isAuthenticated', this.isAuthenticated);
      });

    this.updateTokenTimestampSub = this.store
      .select((state: IAppState) => state.userContext.updateTokenTimestamp)
      .subscribe(x => {
        this.updateToken();
      });
  }

  ngOnDestroy() {
    this.isAuthenticatedSub.unsubscribe();
    this.updateTokenTimestampSub.unsubscribe();
  }

  handleWindowMessage(event: any) {
    if (event.origin === this.ssoConfig.url) {
      const message = JSON.parse(event.data) as {
        type: string;
        data: string;
      };

      console.log(
        `[client] ${message.type}${
          message.data != null ? ': ' + message.data : ''
        }`
      );

      if (message.type === 'ready') {
        this.store.dispatch(new UpdateToken());
      } else if (message.type === 'token') {
        this.store.dispatch(new TokenWasUpdated(message.data));
      } else if (message.type === 'userDidLogout') {
        this.store.dispatch(new UserDidLogout());
      }
    }
  }

  updateToken() {
    this.sso.nativeElement.contentWindow.postMessage(
      `{"type": "getToken", "data": "${this.ssoConfig.aud}"}`,
      this.ssoConfig.url
    );
  }

  login() {
    window.location.href = `${
      this.ssoConfig.url
    }?callbackUrl=${encodeURIComponent(this.ssoConfig.callbackUrl)}`;
  }

  logout() {
    this.sso.nativeElement.contentWindow.postMessage(
      '{"type": "logout"}',
      this.ssoConfig.url
    );
  }
}
