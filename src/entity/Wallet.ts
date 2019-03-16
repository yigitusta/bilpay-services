import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Wallet {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    public: string;

    @Column()
    secret: string;

    @Column({ nullable: true })
    secret_seed: string;

    @Index()
    @Column()
    api_url: string;

    @Column()
    sandbox: boolean;

    @ManyToOne(type => User, user => user.wallets)
    user: User;
}
