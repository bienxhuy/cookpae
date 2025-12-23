import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Step } from "./Step";
import { Recipe } from "./Recipe";

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  publicId!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Step, step => step.attachments, { nullable: true })
  step?: Step;

  @ManyToOne(() => Recipe, recipe => recipe.thumbnails, { nullable: true })
  recipe?: Recipe;

  constructor(publicId?: string, url?: string) {
    super();
    if (publicId && url) {
      this.publicId = publicId;
      this.url = url;
    }
  }
}
