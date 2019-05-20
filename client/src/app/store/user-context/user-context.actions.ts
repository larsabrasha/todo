export class UpdateToken {
  static readonly type = '[UserContext] Update Token';
}

export class TokenWasUpdated {
  static readonly type = '[UserContext] Token Was Updated';
  constructor(public token: string) {}
}

export class UserDidLogout {
  static readonly type = '[UserContext] User Did Logout';
}
