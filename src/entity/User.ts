import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from "typeorm";
import { Wallet } from "./Wallet";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({length: 30})
    email: string;

    @Column()
    password: string;

    @Index()
    @Column({nullable: true})
    token: string;

    @Column()
    merchant: boolean;

    @Column({ type: "json", nullable: true })
    info: string;

    @OneToMany(type => Wallet, wallet => wallet.user)
    wallets: Wallet[];

}
