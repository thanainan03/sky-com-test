import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { Address } from './Address'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    website: string;

    @OneToOne(() => Address)
    @JoinColumn({
      name: 'addressId',
      referencedColumnName: 'id'
    })
    address: Address;
}
