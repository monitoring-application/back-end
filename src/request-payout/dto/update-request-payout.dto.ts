import { PartialType } from '@nestjs/swagger';
import { CreateRequestPayoutDto } from './create-request-payout.dto';

export class UpdateRequestPayoutDto extends PartialType(CreateRequestPayoutDto) {}
