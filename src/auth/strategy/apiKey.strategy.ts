import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../user/auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private authService: AuthService) {
    super({ header: 'api-key', prefix: '' }, true, (apikey, done, req) => {
      authService.validateApiKey(apikey).then((checkKey) => {
        if (!checkKey) {
          return done(new UnauthorizedException(), null);
        }
        return done(null, true);
      });
    });
  }
}
