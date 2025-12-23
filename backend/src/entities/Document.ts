// src/entities/Document.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity("document")
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @Index()
  fileName!: string;

  @Column({ nullable: true })
  originalName?: string;

  @Column({ nullable: true })
  path?: string;

  @Column()
  uploadedBy!: number;

  @Column({ default: false })
  embedded!: boolean;

}