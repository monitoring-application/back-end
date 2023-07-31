import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export class FileManager {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  folder: string;
  @Column({ nullable: true })
  file_name: string;
  @Column({ nullable: true })
  path: string;

  @CreateDateColumn({ select: false })
  created_at: Date;
  @UpdateDateColumn({ select: false })
  updated_at: Date;
  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
