// User repository
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Recipe } from '../entities/Recipe';

export class UserRepository {
  private repository: Repository<User>;
  private recipeRepository: Repository<Recipe>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(User);
    this.recipeRepository = datasource.getRepository(Recipe);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findUserRecipes(userId: number, page: number = 1, pageSize: number = 10): Promise<{ recipes: Recipe[]; total: number }> {
    const [recipes, total] = await this.recipeRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'area', 'categories', 'thumbnails', 'votes'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { recipes, total };
  }

  async findUserVotedRecipes(userId: number, page: number = 1, pageSize: number = 10): Promise<{ recipes: Recipe[]; total: number }> {
    const [recipes, total] = await this.recipeRepository.findAndCount({
      relations: ['user', 'area', 'categories', 'thumbnails', 'votes'],
      where: {
        votes: {
          user: { id: userId },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { recipes, total };
  }
}