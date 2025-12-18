// Category repository
import { Repository, DataSource } from 'typeorm';
import { Category } from '../entities/Category';

export class CategoryRepository {
  private repository: Repository<Category>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(Category);
  }

  async create(name: string): Promise<Category> {
    const category = this.repository.create({ name, isActive: true });
    return this.repository.save(category);
  }

  async findById(id: number): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOneBy({ name });
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async update(id: number, name: string): Promise<Category | null> {
    const category = await this.repository.findOneBy({ id });
    if (!category) {
      return null;
    }
    category.name = name;
    return this.repository.save(category);
  }

  async activate(id: number): Promise<Category | null> {
    const category = await this.repository.findOneBy({ id });
    if (!category) {
      return null;
    }
    category.isActive = true;
    return this.repository.save(category);
  }

  async deactivate(id: number): Promise<Category | null> {
    const category = await this.repository.findOneBy({ id });
    if (!category) {
      return null;
    }
    category.isActive = false;
    return this.repository.save(category);
  }
}
