export class UserContextStateModel {
  token: string;
  email: string;
  name: string;
  isAuthenticated: boolean | null;
}

export const defaults: UserContextStateModel = {
  token: null,
  email: null,
  name: null,
  isAuthenticated: null,
};
