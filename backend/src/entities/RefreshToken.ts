import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity("refresh_token")
export class RefreshToken {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({type: "varchar", unique: true})
    jti!: string

    @ManyToOne(() => User, (user) => user)
    user!: User

    @CreateDateColumn()
    createdAt!: Date
}