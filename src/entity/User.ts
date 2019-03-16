import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({
        length: 30
    })
    email: string;

    @Column()
    password: string;

    @Index()
    @Column({ nullable: true })
    token: string;

}
