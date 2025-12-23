import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
@Index(["tokenHash"], { unique: true })
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "token_hash", length: 255 })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @Column({ default: false })
  revoked!: boolean;

  @Column({ name: "last_used_at", type: "timestamp", nullable: true })
  lastUsedAt!: Date | null;

  constructor(userId?: number, tokenHash?: string, expiresAt?: Date) {
    super();
    if (userId && tokenHash && expiresAt) {
      this.userId = userId;
      this.tokenHash = tokenHash;
      this.expiresAt = expiresAt;
      this.revoked = false;
      this.lastUsedAt = null;
    }
  }
}
