// Category service
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/Category';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async createCategory(name: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(name);
    if (existingCategory) {
      throw new Error('Category name already exists');
    }
    return this.categoryRepository.create(name);
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async updateCategory(id: number, name: string): Promise<Category | null> {
    const existingCategory = await this.categoryRepository.findByName(name);
    if (existingCategory && existingCategory.id !== id) {
      throw new Error('Category name already exists');
    }
    return this.categoryRepository.update(id, name);
  }

  async activateCategory(id: number): Promise<Category | null> {
    return this.categoryRepository.activate(id);
  }

  async deactivateCategory(id: number): Promise<Category | null> {
    return this.categoryRepository.deactivate(id);
  }
}
