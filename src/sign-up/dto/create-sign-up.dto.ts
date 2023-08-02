import { IsPhoneNumber } from 'class-validator';

export class CreateSignUpDto {
  id?: string;
  member_code: string;
  full_name?: string;
  mobile_number: string;
  email: string;
  password: string;
  passwordHash: string;
  upline: string;
  ttlDownline: number;
  status: number;
}
