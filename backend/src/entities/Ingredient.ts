import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { RecipeIngredient } from "./RecipeIngredient";

@Entity()
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.ingredient)
  recipeIngredients!: RecipeIngredient[];

  constructor(name?: string) {
    super();
    if (name) {
      this.name = name;
      this.recipeIngredients = [];
    }
  }
}
