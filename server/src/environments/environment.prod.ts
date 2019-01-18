export const oktaConfig = {
  issuer: '$OKTA_ISSUER',
  clientId: '$OKTA_CLIENT',
  assertClaims: {
    aud: 'api://default',
    cid: '$OKTA_CLIENT',
  },
};