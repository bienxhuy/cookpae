import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ERole } from "./ERole";
import { Recipe } from "./Recipe";
import { Vote } from "./Vote";
import { Notification } from "./Notification";

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

  @Column({ type: "enum", enum: ERole, default: ERole.REGULAR_USER })
  role!: ERole;

  @OneToMany(() => Recipe, recipe => recipe.user)
  recipes!: Recipe[];

  @OneToMany(() => Vote, vote => vote.user)
  votes!: Vote[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications!: Notification[];

  constructor(name?: string, email?: string, password?: string) {
    super();
    if (name && email && password) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.role = ERole.REGULAR_USER;
      this.recipes = [];
      this.votes = [];
      this.notifications = [];
    }
  }
}
