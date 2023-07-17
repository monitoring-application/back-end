import { PartialType } from '@nestjs/swagger';
import { CreateSignUpDto } from './create-sign-up.dto';

export class UpdateSignUpDto extends PartialType(CreateSignUpDto) {}
