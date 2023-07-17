import { IsPhoneNumber } from 'class-validator';

export class CreateSignUpDto {
  id?: string;
  member_code: string;
  first_name?: string;
  last_name?: string;
  email: string;
  referal_code: string;
  mobile_number: string;
  status: number;
}
