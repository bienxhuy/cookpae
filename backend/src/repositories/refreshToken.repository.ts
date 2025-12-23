import { RefreshToken } from "../entities/RefreshToken";
import { LessThanOrEqual, MoreThan, Repository, DataSource } from "typeorm";

export class RefreshTokenRepository {
  private repository: Repository<RefreshToken>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(RefreshToken);
  }

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    return await this.repository.save(refreshToken);
  }

  async findValidByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return await this.repository.findOne({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ["user"],
    });
  }

  async updateLastUsed(id: number): Promise<void> {
    await this.repository.update(id, { lastUsedAt: new Date() });
  }

  async revoke(id: number): Promise<void> {
    await this.repository.update(id, { revoked: true });
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await this.repository.update({ tokenHash }, { revoked: true });
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.repository.update({ userId }, { revoked: true });
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });
  }
}
