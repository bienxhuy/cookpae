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
    return this.areaRepository.create(name);
  }

  async getAreaById(id: number): Promise<Area | null> {
    return this.areaRepository.findById(id);
  }

  async getAllAreas(): Promise<Area[]> {
    return this.areaRepository.findAll();
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
