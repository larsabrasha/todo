export class UserContextStateModel {
  token: string;
  email: string;
  name: string;
  isAuthenticated: boolean | null;
  updateTokenTimestamp: Date;
}

export const defaults: UserContextStateModel = {
  token: null,
  email: null,
  name: null,
  isAuthenticated: null,
  updateTokenTimestamp: null,
};
