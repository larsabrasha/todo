export const environment = {
  production: true,
  oktaConfig: {
    issuer: '$OKTA_ISSUER',
    redirectUri: '$OKTA_REDIRECT_URI',
    clientId: '$OKTA_CLIENT',
  },
};
