import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
