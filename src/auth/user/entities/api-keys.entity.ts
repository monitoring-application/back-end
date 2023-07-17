
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Apikey {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column({ nullable: true })
    key: string
    @Column({ default: true })
    active: boolean
    @Column({ nullable: true })
    remarks: string
    @CreateDateColumn()
    created_at: Date
    @UpdateDateColumn()
    update_at: Date
    @DeleteDateColumn()
    deleted_at: Date
}

