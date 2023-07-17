import { Module } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignUp } from './entities/sign-up.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SignUp])],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
