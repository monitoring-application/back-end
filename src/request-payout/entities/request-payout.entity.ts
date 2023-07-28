import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RequestPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  member_id: string;
  @Column({ nullable: true })
  member_name: string;
  @Column({ nullable: true })
  gcash_number: string;
  @Column({ nullable: true })
  amount: number;
  @Column({ nullable: true })
  status: number;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn({ select: false })
  updated_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
