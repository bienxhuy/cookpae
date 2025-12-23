// Ingredient controller
import { Request, Response } from 'express';
import { IngredientService } from '../services/ingredient.service';

export class IngredientController {
  private ingredientService: IngredientService;

  constructor(ingredientService: IngredientService) {
    this.ingredientService = ingredientService;
  }

  // Create ingredient
  // POST /ingredients
  async createIngredient(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const ingredient = await this.ingredientService.createIngredient(name);
      res.status(201).json({ status: "success", data: ingredient });
    }
    catch (error) {
      if (error instanceof Error && error.message === 'Ingredient name already exists') {
        res.status(409).json({ status: "error", message: 'Ingredient name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Get ingredient by ID
  // GET /ingredients/:id
  async getIngredient(req: Request, res: Response): Promise<void> {
    try {
      const ingredientId = parseInt(req.params.id, 10);
      const ingredient = await this.ingredientService.getIngredientById(ingredientId);
      if (ingredient) {
        res.json({ status: "success", data: ingredient });
      } else {
        res.status(404).json({ status: "error", message: 'Ingredient not found' });
      }
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Get all ingredients with pagination
  // GET /ingredients?page=1&pageSize=10
  async getAllIngredients(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.ingredientService.getAllIngredients(page, pageSize);
      res.json({ status: "success", data: result });
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Update ingredient by ID
  // PUT /ingredients/:id
  async updateIngredient(req: Request, res: Response): Promise<void> {
    try {
      const ingredientId = parseInt(req.params.id, 10);
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const ingredient = await this.ingredientService.updateIngredient(ingredientId, name);
      if (ingredient) {
        res.json({ status: "success", data: ingredient });
      } else {
        res.status(404).json({ status: "error", message: 'Ingredient not found' });
      }
    }
    catch (error) {
      if (error instanceof Error && error.message === 'Ingredient name already exists') {
        res.status(409).json({ status: "error", message: 'Ingredient name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }
}
