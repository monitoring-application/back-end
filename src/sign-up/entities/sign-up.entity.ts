import { IsNotEmpty } from 'class-validator';
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
  full_name: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  passwordHash: string;
  @Column({ nullable: true })
  mobile_number: string;
  @Column({ nullable: true })
  upline: string;
  @Column({ default: 0 })
  ttlDownline: number;
  @Column({ nullable: true })
  status: number;

  @CreateDateColumn({ select: false })
  created_at: Date;
  @UpdateDateColumn({ select: false })
  updated_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
