import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: '' })
  email: string;
  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  name: string;
  @Column({ default: '' })
  first_name: string;
  @Column({ default: '' })
  last_name: string;
  @Column({ default: '' })
  middle_name: string;
  @Column({ default: '' })
  name_ext: string;

  @Column({ default: '' })
  position: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  isReset: boolean;

  @Column({ nullable: true })
  contact: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  default: boolean;

  @Column({ default: false, select: false })
  logged_in: boolean;

  @Column({ default: false, select: false })
  hidden: boolean;

  @Column({ type: 'text', nullable: true, select: false })
  rt: string;

  @CreateDateColumn({ select: false })
  created_at: Date;
  @UpdateDateColumn({ select: false })
  update_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
