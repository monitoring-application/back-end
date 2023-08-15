import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('files')
export class FileManager {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  member_id: string;
  @Column({ nullable: true })
  folder: string;
  @Column({ nullable: true })
  orig_name: string;
  @Column({ nullable: true })
  file_name: string;
  @Column({ nullable: true })
  path: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ nullable: true })
  social_media: string;
  @Column({ nullable: true })
  page_name: string;

  @Column({ default: 0 })
  status: number;

  @CreateDateColumn({ select: false })
  created_at: Date;
  @UpdateDateColumn({ select: false })
  updated_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
