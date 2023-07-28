import { Module } from '@nestjs/common';
import { RequestPayoutService } from './request-payout.service';
import { RequestPayoutController } from './request-payout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestPayout } from './entities/request-payout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestPayout])],
  controllers: [RequestPayoutController],
  providers: [RequestPayoutService],
})
export class RequestPayoutModule {}
