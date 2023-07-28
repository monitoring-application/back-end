export class CreateRequestPayoutDto {
  id: string;
  member_id: string;
  member_name: string;
  gcash_number: string;
  amount: number;
  status: number;
  paid_at: Date;
}
