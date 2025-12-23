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
    const category = new Category(name);
    return this.categoryRepository.save(category);
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async getAllCategories(page: number = 1, pageSize: number = 10) {
    const { categories, total } = await this.categoryRepository.findAll(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      categories,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
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
