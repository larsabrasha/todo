import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError } from 'jsonwebtoken';
import { environment } from './environments/environment';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/Bearer (.+)/);

      if (!match) {
        return res.status(401).end();
      }

      const accessToken = match[1];

      try {
        const decodedToken = this.jwtService.verify(accessToken);

        if (
          decodedToken.iss !== environment.iss ||
          decodedToken.aud !== environment.aud ||
          new Date().getTime() > decodedToken.exp * 1000
        ) {
          res.status(401).send('Invalid token');
          return;
        }

        req.decodedToken = decodedToken;
        next();
      } catch (e) {
        if (e instanceof JsonWebTokenError) {
          res.status(401).send('Invalid token');
          return;
        } else {
          throw e;
        }
      }
    };
  }
}
