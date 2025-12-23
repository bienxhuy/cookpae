// Area controller
import { Request, Response } from 'express';
import { AreaService } from '../services/area.service';

export class AreaController {
  private areaService: AreaService;

  constructor(areaService: AreaService) {
    this.areaService = areaService;
  }

  // Create area
  // POST /areas
  async createArea(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      console.log("Received name:", name);
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const area = await this.areaService.createArea(name);
      res.status(201).json({ status: "success", data: area });
    }
    catch (error) {
      console.log("Error creating area:", error);
      if (error instanceof Error && error.message === 'Area name already exists') {
        res.status(409).json({ status: "error", message: 'Area name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Get area by ID
  // GET /areas/:id
  async getArea(req: Request, res: Response): Promise<void> {
    try {
      const areaId = parseInt(req.params.id, 10);
      const area = await this.areaService.getAreaById(areaId);
      if (area) {
        res.json({ status: "success", data: area });
      } else {
        res.status(404).json({ status: "error", message: 'Area not found' });
      }
    }
    catch (error) {
      console.log("Error fetching area:", error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Get all areas with pagination
  // GET /areas?page=1&pageSize=10
  async getAllAreas(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.areaService.getAllAreas(page, pageSize);
      res.json({ status: "success", data: result });
    }
    catch (error) {
      console.log("Error fetching areas:", error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Update area by ID
  // PUT /areas/:id
  async updateArea(req: Request, res: Response): Promise<void> {
    try {
      const areaId = parseInt(req.params.id, 10);
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const area = await this.areaService.updateArea(areaId, name);
      if (area) {
        res.json({ status: "success", data: area });
      } else {
        res.status(404).json({ status: "error", message: 'Area not found' });
      }
    }
    catch (error) {
      console.log("Error updating area:", error);
      if (error instanceof Error && error.message === 'Area name already exists') {
        res.status(409).json({ status: "error", message: 'Area name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Activate area by ID
  // PATCH /areas/:id/activate
  async activateArea(req: Request, res: Response): Promise<void> {
    try {
      const areaId = parseInt(req.params.id, 10);
      const area = await this.areaService.activateArea(areaId);
      if (area) {
        res.json({ status: "success", data: area });
      } else {
        res.status(404).json({ status: "error", message: 'Area not found' });
      }
    }
    catch (error) {
      console.log("Error activating area:", error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Deactivate area by ID
  // PATCH /areas/:id/deactivate
  async deactivateArea(req: Request, res: Response): Promise<void> {
    try {
      const areaId = parseInt(req.params.id, 10);
      const area = await this.areaService.deactivateArea(areaId);
      if (area) {
        res.json({ status: "success", data: area });
      } else {
        res.status(404).json({ status: "error", message: 'Area not found' });
      }
    }
    catch (error) {
      console.log("Error deactivating area:", error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }
}
