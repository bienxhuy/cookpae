// User repository
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(User);
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const user = this.repository.create({ name, email, password });
    return this.repository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}