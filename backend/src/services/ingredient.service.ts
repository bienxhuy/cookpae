// Ingredient service
import { IngredientRepository } from '../repositories/ingredient.repository';
import { Ingredient } from '../entities/Ingredient';

export class IngredientService {
  private ingredientRepository: IngredientRepository;

  constructor(ingredientRepository: IngredientRepository) {
    this.ingredientRepository = ingredientRepository;
  }

  async createIngredient(name: string): Promise<Ingredient> {
    const existingIngredient = await this.ingredientRepository.findByName(name);
    if (existingIngredient) {
      throw new Error('Ingredient name already exists');
    }
    const ingredient = new Ingredient(name);
    return this.ingredientRepository.save(ingredient);
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findById(id);
  }

  async getAllIngredients(page: number = 1, pageSize: number = 10) {
    const { ingredients, total } = await this.ingredientRepository.findAll(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      ingredients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async updateIngredient(id: number, name: string): Promise<Ingredient | null> {
    const existingIngredient = await this.ingredientRepository.findByName(name);
    if (existingIngredient && existingIngredient.id !== id) {
      throw new Error('Ingredient name already exists');
    }
    return this.ingredientRepository.update(id, name);
  }
}
