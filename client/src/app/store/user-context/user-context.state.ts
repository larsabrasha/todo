import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Action, State, StateContext } from '@ngxs/store';
import { TokenWasUpdated, UserDidLogout } from './user-context.actions';
import { defaults, UserContextStateModel } from './user-context.model';

@State<UserContextStateModel>({
  name: 'userContext',
  defaults: defaults,
})
export class UserContextState {
  constructor(private router: Router, private ngZone: NgZone) {}

  @Action(TokenWasUpdated)
  tokenWasUpdate(
    context: StateContext<UserContextStateModel>,
    action: TokenWasUpdated
  ) {
    const decodedToken = action.token ? this.parseJwt(action.token) : null;
    const email = decodedToken ? decodedToken.sub : null;
    const name = decodedToken ? decodedToken.name : null;

    context.patchState({
      token: action.token,
      email,
      name,
      isAuthenticated: action.token != null,
    });
  }

  @Action(UserDidLogout)
  userDidLogout(context: StateContext<UserContextStateModel>) {
    context.patchState({
      ...defaults,
      isAuthenticated: false,
    });
    this.ngZone.run(() => {
      this.router.navigate(['/']);
    });
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
