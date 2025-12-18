// Category controller
import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  // Create category
  // POST /categories
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const category = await this.categoryService.createCategory(name);
      res.status(201).json({ status: "success", data: category });
    }
    catch (error) {
      if (error instanceof Error && error.message === 'Category name already exists') {
        res.status(409).json({ status: "error", message: 'Category name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Get category by ID
  // GET /categories/:id
  async getCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const category = await this.categoryService.getCategoryById(categoryId);
      if (category) {
        res.json({ status: "success", data: category });
      } else {
        res.status(404).json({ status: "error", message: 'Category not found' });
      }
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Update category by ID
  // PUT /categories/:id
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ status: "error", message: 'Name is required' });
        return;
      }
      const category = await this.categoryService.updateCategory(categoryId, name);
      if (category) {
        res.json({ status: "success", data: category });
      } else {
        res.status(404).json({ status: "error", message: 'Category not found' });
      }
    }
    catch (error) {
      if (error instanceof Error && error.message === 'Category name already exists') {
        res.status(409).json({ status: "error", message: 'Category name already exists' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Activate category by ID
  // PATCH /categories/:id/activate
  async activateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const category = await this.categoryService.activateCategory(categoryId);
      if (category) {
        res.json({ status: "success", data: category });
      } else {
        res.status(404).json({ status: "error", message: 'Category not found' });
      }
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Deactivate category by ID
  // PATCH /categories/:id/deactivate
  async deactivateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const category = await this.categoryService.deactivateCategory(categoryId);
      if (category) {
        res.json({ status: "success", data: category });
      } else {
        res.status(404).json({ status: "error", message: 'Category not found' });
      }
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }
}
