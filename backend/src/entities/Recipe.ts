import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Step } from "./Step";
import { Attachment } from "./Attachment";
import { RecipeIngredient } from "./RecipeIngredient";
import { Category } from "./Category";
import { Area } from "./Area";
import { Vote } from "./Vote";

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => User, user => user.recipes)
  user!: User;

  @OneToMany(() => Step, step => step.recipe, { cascade: true })
  steps!: Step[];

  @OneToMany(() => Attachment, attachment => attachment.recipe, { cascade: true })
  thumbnails!: Attachment[];

  @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.recipe, { cascade: true })
  recipeIngredients!: RecipeIngredient[];

  @ManyToMany(() => Category, category => category.recipes)
  @JoinTable()
  categories!: Category[];

  @ManyToOne(() => Area, area => area.recipes)
  area!: Area;

  @OneToMany(() => Vote, vote => vote.recipe)
  votes!: Vote[];

  constructor(name?: string, description?: string, user?: User, area?: Area) {
    super();
    if (name && description && user && area) {
      this.name = name;
      this.description = description;
      this.user = user;
      this.area = area;
      this.steps = [];
      this.thumbnails = [];
      this.recipeIngredients = [];
      this.categories = [];
      this.votes = [];
    }
  }
}
