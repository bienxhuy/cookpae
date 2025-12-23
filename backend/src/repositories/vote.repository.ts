// Vote repository
import { Repository, DataSource } from 'typeorm';
import { Vote } from '../entities/Vote';

export class VoteRepository {
  private repository: Repository<Vote>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(Vote);
  }

  async save(vote: Vote): Promise<Vote> {
    return this.repository.save(vote);
  }

  async findByUserAndRecipe(userId: number, recipeId: number): Promise<Vote | null> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        recipe: { id: recipeId },
      },
    });
  }

  async delete(userId: number, recipeId: number): Promise<boolean> {
    const result = await this.repository.delete({
      user: { id: userId },
      recipe: { id: recipeId },
    });
    return result.affected !== 0;
  }
}
