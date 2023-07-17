import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SignUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  member_code: string;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  referal_code: string;
  @Column({ nullable: true })
  mobile_number: string;

  @Column({ nullable: true })
  status: number;

  @CreateDateColumn({ select: false })
  created_at: Date;
  @UpdateDateColumn({ select: false })
  updated_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
