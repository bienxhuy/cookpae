import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";

@Entity()
export class Area extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Recipe, recipe => recipe.area)
  recipes!: Recipe[];

  constructor(name?: string) {
    super();
    if (name) {
      this.name = name;
      this.isActive = true;
      this.recipes = [];
    }
  }
}
