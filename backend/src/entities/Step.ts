import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Recipe } from "./Recipe";
import { Attachment } from "./Attachment";

@Entity()
export class Step extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order!: number;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Recipe, recipe => recipe.steps)
  recipe!: Recipe;

  @OneToMany(() => Attachment, attachment => attachment.step, { cascade: true })
  attachments!: Attachment[];

  constructor(order?: number, description?: string, recipe?: Recipe) {
    super();
    if (order !== undefined && description && recipe) {
      this.order = order;
      this.description = description;
      this.recipe = recipe;
      this.attachments = [];
    }
  }
}
