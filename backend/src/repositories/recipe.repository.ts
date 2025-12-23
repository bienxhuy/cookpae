// Recipe repository
import { Repository, DataSource } from 'typeorm';
import { Recipe } from '../entities/Recipe';
import { Attachment } from '../entities/Attachment';

export class RecipeRepository {
  private recipeRepository: Repository<Recipe>;
  private attachmentRepository: Repository<Attachment>;

  constructor(datasource: DataSource) {
    this.recipeRepository = datasource.getRepository(Recipe);
    this.attachmentRepository = datasource.getRepository(Attachment);
  }

  async save(recipe: Recipe): Promise<Recipe> {
    return this.recipeRepository.save(recipe);
  }

  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: [
        'user',
        'area',
        'categories',
        'thumbnails',
        'steps',
        'steps.attachments',
        'recipeIngredients',
        'recipeIngredients.ingredient',
        'votes',
        'votes.user',
      ],
      order: {
        steps: {
          order: 'ASC',
        },
        recipeIngredients: {
          order: 'ASC',
        },
      },
    });
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<{ recipes: Recipe[]; total: number }> {
    const [recipes, total] = await this.recipeRepository.findAndCount({
      relations: [
        'user',
        'area',
        'categories',
        'thumbnails',
        'votes',
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { recipes, total };
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

  async countUserRecipes(userId: number): Promise<number> {
    return this.recipeRepository.count({
      where: { user: { id: userId } },
    });
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

  async getAllAttachments(recipeId: number): Promise<Attachment[]> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['thumbnails', 'steps', 'steps.attachments'],
    });

    if (!recipe) {
      return [];
    }

    const attachments: Attachment[] = [];

    // Collect thumbnails
    if (recipe.thumbnails) {
      attachments.push(...recipe.thumbnails);
    }

    // Collect step attachments
    if (recipe.steps) {
      recipe.steps.forEach(step => {
        if (step.attachments) {
          attachments.push(...step.attachments);
        }
      });
    }

    return attachments;
  }

  async deleteAttachments(attachmentIds: number[]): Promise<void> {
    if (attachmentIds.length > 0) {
      await this.attachmentRepository.delete(attachmentIds);
    }
  }

  async filterRecipes(filters: {
    ingredientIds?: number[];
    categoryIds?: number[];
    areaIds?: number[];
    page: number;
    pageSize: number;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    const { ingredientIds, categoryIds, areaIds, page, pageSize } = filters;
    const offset = (page - 1) * pageSize;

    const queryBuilder = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.area', 'area')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.thumbnails', 'thumbnail')
      .leftJoinAndSelect('recipe.votes', 'vote');

    // Filter by areas (OR logic - recipe belongs to ONE of the areas)
    if (areaIds && areaIds.length > 0) {
      queryBuilder.andWhere('recipe.area.id IN (:...areaIds)', { areaIds });
    }

    // Filter by categories (OR logic - recipe has at least one of the categories)
    if (categoryIds && categoryIds.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    // Filter by ingredients (OR logic - recipe uses at least one of the ingredients)
    if (ingredientIds && ingredientIds.length > 0) {
      queryBuilder
        .leftJoin('recipe.recipeIngredients', 'recipeIngredient')
        .leftJoin('recipeIngredient.ingredient', 'ingredient')
        .andWhere('ingredient.id IN (:...ingredientIds)', { ingredientIds });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const recipes = await queryBuilder
      .skip(offset)
      .take(pageSize)
      .getMany();

    return { recipes, total };
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return result.affected !== 0;
  }
}
