// Recipe controller
import { Request, Response } from 'express';
import { RecipeService } from '../services/recipe.service';

export class RecipeController {
  private recipeService: RecipeService;

  constructor(recipeService: RecipeService) {
    this.recipeService = recipeService;
  }

  // Create recipe
  // POST /recipes
  async createRecipe(req: Request, res: Response): Promise<void> {
    try {
      console.log('Create recipe request body:', req.body);
      const {
        name,
        description,
        areaId,
        categoryIds,
        thumbnailImages,
        steps,
        recipeIngredients
      } = req.body;

      // Validation
      if (!name || !description || !areaId) {
        res.status(400).json({
          status: "error",
          message: 'Name, description, and areaId are required'
        });
        return;
      }

      if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        res.status(400).json({
          status: "error",
          message: 'At least one category is required'
        });
        return;
      }

      // Convert base64 images to buffers
      const thumbnailBuffers: Buffer[] = [];
      if (thumbnailImages && Array.isArray(thumbnailImages)) {
        for (const imgData of thumbnailImages) {
          if (imgData.data) {
            thumbnailBuffers.push(Buffer.from(imgData.data, 'base64'));
          }
        }
      }

      // Process steps with images
      const processedSteps: { order: number; description: string; images?: Buffer[] }[] = [];
      if (steps && Array.isArray(steps)) {
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          const stepImages: Buffer[] = [];
          if (step.images && Array.isArray(step.images)) {
            for (const imgData of step.images) {
              if (imgData.data) {
                stepImages.push(Buffer.from(imgData.data, 'base64'));
              }
            }
          }
          processedSteps.push({
            order: step.order !== undefined ? step.order : i + 1,
            description: step.description,
            images: stepImages.length > 0 ? stepImages : undefined,
          });
        }
      }

      // Process recipe ingredients with order
      const processedIngredients: { ingredientId: number; order: number; quantity: number; unit: string }[] = [];
      if (recipeIngredients && Array.isArray(recipeIngredients)) {
        for (let i = 0; i < recipeIngredients.length; i++) {
          const ri = recipeIngredients[i];
          processedIngredients.push({
            ingredientId: ri.ingredientId,
            order: ri.order !== undefined ? ri.order : i + 1,
            quantity: ri.quantity,
            unit: ri.unit,
          });
        }
      }

      // Hardcode userId to 1 for now
      const userId = 1;

      const recipe = await this.recipeService.createRecipe({
        name,
        description,
        userId,
        areaId: parseInt(areaId),
        categoryIds: categoryIds.map((id: any) => parseInt(id)),
        thumbnailImages: thumbnailBuffers.length > 0 ? thumbnailBuffers : undefined,
        steps: processedSteps.length > 0 ? processedSteps : undefined,
        recipeIngredients: processedIngredients.length > 0 ? processedIngredients : undefined,
      });

      res.status(201).json({ status: "success", data: recipe });
    }
    catch (error) {
      console.error('Error creating recipe:', error);
      if (error instanceof Error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Get recipe by ID
  // GET /recipes/:id
  async getRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const recipe = await this.recipeService.getRecipeById(recipeId);
      
      if (recipe) {
        res.json({ status: "success", data: recipe });
      } else {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      }
    }
    catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Get all recipes with pagination
  // GET /recipes?page=1&pageSize=10
  async getAllRecipes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await this.recipeService.getAllRecipes(page, pageSize);
      res.json({ status: "success", data: result });
    }
    catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Update recipe by ID
  // PUT /recipes/:id
  async updateRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const {
        name,
        description,
        areaId,
        categoryIds,
        thumbnailImages,
        steps,
        recipeIngredients
      } = req.body;

      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (areaId !== undefined) updateData.areaId = parseInt(areaId);
      if (categoryIds !== undefined) {
        updateData.categoryIds = categoryIds.map((id: any) => parseInt(id));
      }

      // Convert base64 images to buffers
      if (thumbnailImages !== undefined) {
        const thumbnailBuffers: Buffer[] = [];
        if (Array.isArray(thumbnailImages)) {
          for (const imgData of thumbnailImages) {
            if (imgData.data) {
              thumbnailBuffers.push(Buffer.from(imgData.data, 'base64'));
            }
          }
        }
        updateData.thumbnailImages = thumbnailBuffers;
      }

      // Process steps with images
      if (steps !== undefined) {
        const processedSteps: { order: number; description: string; images?: Buffer[] }[] = [];
        if (Array.isArray(steps)) {
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const stepImages: Buffer[] = [];
            if (step.images && Array.isArray(step.images)) {
              for (const imgData of step.images) {
                if (imgData.data) {
                  stepImages.push(Buffer.from(imgData.data, 'base64'));
                }
              }
            }
            processedSteps.push({
              order: step.order !== undefined ? step.order : i + 1,
              description: step.description,
              images: stepImages.length > 0 ? stepImages : undefined,
            });
          }
        }
        updateData.steps = processedSteps;
      }

      // Process recipe ingredients with order
      if (recipeIngredients !== undefined) {
        const processedIngredients: { ingredientId: number; order: number; quantity: number; unit: string }[] = [];
        if (Array.isArray(recipeIngredients)) {
          for (let i = 0; i < recipeIngredients.length; i++) {
            const ri = recipeIngredients[i];
            processedIngredients.push({
              ingredientId: ri.ingredientId,
              order: ri.order !== undefined ? ri.order : i + 1,
              quantity: ri.quantity,
              unit: ri.unit,
            });
          }
        }
        updateData.recipeIngredients = processedIngredients;
      }

      const recipe = await this.recipeService.updateRecipe(recipeId, updateData);
      
      if (recipe) {
        res.json({ status: "success", data: recipe });
      } else {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      }
    }
    catch (error) {
      console.error('Error updating recipe:', error);
      if (error instanceof Error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Delete recipe by ID
  // DELETE /recipes/:id
  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      await this.recipeService.deleteRecipe(recipeId);
      res.status(204).send();
    }
    catch (error) {
      console.error('Error deleting recipe:', error);
      if (error instanceof Error && error.message === 'Recipe not found') {
        res.status(404).json({ status: "error", message: 'Recipe not found' });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Filter recipes
  // GET /recipes/filter?page=1&pageSize=10&ingredientIds=1,2,3&categoryIds=1,2&areaIds=1
  async filterRecipes(req: Request, res: Response): Promise<void> {
    try {
      // Console log all params
      console.log('Filter params:', req.query);

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;

      // Parse comma-separated IDs from query parameters and filter out NaN values
      const parsedIngredientIds = req.query.ingredientIds 
        ? (req.query.ingredientIds as string).split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
        : undefined;
      const parsedCategoryIds = req.query.categoryIds 
        ? (req.query.categoryIds as string).split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
        : undefined;
      const parsedAreaIds = req.query.areaIds 
        ? (req.query.areaIds as string).split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
        : undefined;

      // If arrays are empty after filtering, set to undefined
      const ingredientIds = parsedIngredientIds && parsedIngredientIds.length > 0 ? parsedIngredientIds : undefined;
      const categoryIds = parsedCategoryIds && parsedCategoryIds.length > 0 ? parsedCategoryIds : undefined;
      const areaIds = parsedAreaIds && parsedAreaIds.length > 0 ? parsedAreaIds : undefined;

      const result = await this.recipeService.filterRecipes({
        ingredientIds,
        categoryIds,
        areaIds,
        page,
        pageSize,
      });

      res.json({ 
        status: "success", 
        data: {
          recipes: result.recipes,
          pagination: {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
            totalPages: result.totalPages,
          }
        }
      });
    }
    catch (error) {
      console.error('Error filtering recipes:', error);
      if (error instanceof Error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Vote for a recipe
  // POST /recipes/:id/vote
  async voteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const userId = 2; // Hardcoded user ID for now, TODO: get from auth
      
      await this.recipeService.voteRecipe(recipeId, userId);
      res.status(200).json({ status: "success", message: 'Vote added successfully' });
    }
    catch (error) {
      console.error('Error voting recipe:', error);
      if (error instanceof Error) {
        if (error.message === 'Recipe not found') {
          res.status(404).json({ status: "error", message: 'Recipe not found' });
        } else if (error.message === 'User has already voted for this recipe') {
          res.status(409).json({ status: "error", message: 'User has already voted for this recipe' });
        } else {
          res.status(400).json({ status: "error", message: error.message });
        }
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }

  // Unvote a recipe
  // DELETE /recipes/:id/unvote
  async unvoteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id, 10);
      const userId = 2; // Hardcoded user ID for now, TODO: get from auth
      
      await this.recipeService.unvoteRecipe(recipeId, userId);
      res.status(200).json({ status: "success", message: 'Vote removed successfully' });
    }
    catch (error) {
      console.error('Error unvoting recipe:', error);
      if (error instanceof Error) {
        if (error.message === 'Recipe not found') {
          res.status(404).json({ status: "error", message: 'Recipe not found' });
        } else if (error.message === 'User has not voted for this recipe') {
          res.status(404).json({ status: "error", message: 'User has not voted for this recipe' });
        } else {
          res.status(400).json({ status: "error", message: error.message });
        }
      } else {
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
  }
}
