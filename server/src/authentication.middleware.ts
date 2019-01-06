import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
// tslint:disable-next-line:no-var-requires
const OktaJwtVerifier = require('@okta/jwt-verifier');

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-864778.oktapreview.com/oauth2/default',
    clientId: '0oahkwubz9Vyq8CPj0h7',
    assertClaims: {
      aud: 'api://default',
      cid: '0oahkwubz9Vyq8CPj0h7',
    },
  });

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/Bearer (.+)/);

      if (!match) {
        return res.status(401).end();
      }

      const accessToken = match[1];

      return this.oktaJwtVerifier
        .verifyAccessToken(accessToken)
        .then(jwt => {
          req.jwt = jwt;
          next();
        })
        .catch(err => {
          res.status(401).send(err.message);
        });
    };
  }
}
