import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { AdminUser } from './entities/user.entity';
import { AdminToken } from './entities/personal_tokens';
import { Apikey } from './entities/api-keys.entity';

// @Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, AdminToken, Apikey]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
