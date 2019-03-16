import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class WalletKeys {

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({
        length: 30
    })
    public: string;

    @Column()
    private: string;

    @Index()
    @Column()
    api_url: string;

}
