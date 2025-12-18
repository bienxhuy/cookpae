import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToMany(() => Recipe, recipe => recipe.categories)
  recipes!: Recipe[];
}
