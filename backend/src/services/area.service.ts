// Area service
import { AreaRepository } from '../repositories/area.repository';
import { Area } from '../entities/Area';

export class AreaService {
  private areaRepository: AreaRepository;

  constructor(areaRepository: AreaRepository) {
    this.areaRepository = areaRepository;
  }

  async createArea(name: string): Promise<Area> {
    const existingArea = await this.areaRepository.findByName(name);
    if (existingArea) {
      throw new Error('Area name already exists');
    }
    const area = new Area(name);
    return this.areaRepository.save(area);
  }

  async getAreaById(id: number): Promise<Area | null> {
    return this.areaRepository.findById(id);
  }

  async getAllAreas(page: number = 1, pageSize: number = 10) {
    const { areas, total } = await this.areaRepository.findAll(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      areas,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async updateArea(id: number, name: string): Promise<Area | null> {
    const existingArea = await this.areaRepository.findByName(name);
    if (existingArea && existingArea.id !== id) {
      throw new Error('Area name already exists');
    }
    return this.areaRepository.update(id, name);
  }

  async activateArea(id: number): Promise<Area | null> {
    return this.areaRepository.activate(id);
  }

  async deactivateArea(id: number): Promise<Area | null> {
    return this.areaRepository.deactivate(id);
  }
}
