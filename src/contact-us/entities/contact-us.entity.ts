import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ContactUs {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ default: '' })
    first_name: string
    @Column({ default: '' })
    last_name: string
    @Column({ default: '' })
    email: string
    @Column({ type: 'text', nullable: true })
    message: string

    @CreateDateColumn()
    cat: Date
    @DeleteDateColumn()
    dat: Date
}
