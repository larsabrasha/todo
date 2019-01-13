import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { oktaConfig } from './environments/environment';
// tslint:disable-next-line:no-var-requires
const OktaJwtVerifier = require('@okta/jwt-verifier');

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  oktaJwtVerifier = new OktaJwtVerifier(oktaConfig);

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
