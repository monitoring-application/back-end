import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JWTStrategy, LocalStrategy, RefreshTokenStrategy } from '../strategy';
import { UserService } from './user.service';
import { AdminUser } from './entities/user.entity';
import { AdminToken } from './entities/personal_tokens';
import { Apikey } from './entities/api-keys.entity';
import { ApiKeyStrategy } from '../strategy/apiKey.strategy';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AdminToken, Apikey]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secretOrPrivateKey: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),],
  providers: [AuthService, UserService,
    LocalStrategy,
    JWTStrategy,
    RefreshTokenStrategy,
    ApiKeyStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
