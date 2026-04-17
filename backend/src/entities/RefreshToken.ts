import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity("refresh_token")
export class RefreshToken {

    @PrimaryGeneratedColumn("uuid")
    id_refresh!: string

    @Column({type: "varchar", unique: true})
    jti!: string

    @ManyToOne(() => User, (user) => user.token)
    @JoinColumn({name: "token_id"})
    user!: User

    @CreateDateColumn()
    createdAt!: Date
}