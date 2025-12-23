import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";
import { Ingredient } from "./Ingredient";

@Entity()
export class RecipeIngredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order!: number;

  @Column({ type: "float" })
  quantity!: number;

  @Column()
  unit!: string;

  @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients)
  recipe!: Recipe;

  @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredients)
  ingredient!: Ingredient;

  constructor(order?: number, quantity?: number, unit?: string, recipe?: Recipe, ingredient?: Ingredient) {
    super();
    if (order !== undefined && quantity !== undefined && unit && recipe && ingredient) {
      this.order = order;
      this.quantity = quantity;
      this.unit = unit;
      this.recipe = recipe;
      this.ingredient = ingredient;
    }
  }
}
