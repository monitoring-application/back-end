
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AdminToken {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    userId: string
    @Column({ default: '' })
    keys: string
    @Column({ default: '' })
    refresh_token: string
    @Column()
    expired_at: Date
    @Column()
    last_used_at: Date
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    update_at: Date
    @DeleteDateColumn()
    deleted_at: Date
}

