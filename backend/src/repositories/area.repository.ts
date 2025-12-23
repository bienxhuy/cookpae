// Area repository
import { Repository, DataSource } from 'typeorm';
import { Area } from '../entities/Area';

export class AreaRepository {
  private repository: Repository<Area>;

  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(Area);
  }

  async save(area: Area): Promise<Area> {
    return this.repository.save(area);
  }

  async findById(id: number): Promise<Area | null> {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<Area | null> {
    return this.repository.findOneBy({ name });
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<{ areas: Area[]; total: number }> {
    const [areas, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { areas, total };
  }

  async update(id: number, name: string): Promise<Area | null> {
    const area = await this.repository.findOneBy({ id });
    if (!area) {
      return null;
    }
    area.name = name;
    return this.repository.save(area);
  }

  async activate(id: number): Promise<Area | null> {
    const area = await this.repository.findOneBy({ id });
    if (!area) {
      return null;
    }
    area.isActive = true;
    return this.repository.save(area);
  }

  async deactivate(id: number): Promise<Area | null> {
    const area = await this.repository.findOneBy({ id });
    if (!area) {
      return null;
    }
    area.isActive = false;
    return this.repository.save(area);
  }
}
