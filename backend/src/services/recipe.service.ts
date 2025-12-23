// Recipe service
import { RecipeRepository } from '../repositories/recipe.repository';
import { UserService } from './user.service';
import { AreaService } from './area.service';
import { CategoryService } from './category.service';
import { IngredientService } from './ingredient.service';
import { VoteService } from './vote.service';
import { Recipe } from '../entities/Recipe';
import { Step } from '../entities/Step';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { Attachment } from '../entities/Attachment';
import { uploadImage, deleteImages } from './cloud.service';

export class RecipeService {
  private recipeRepository: RecipeRepository;
  private userService: UserService;
  private areaService: AreaService;
  private categoryService: CategoryService;
  private ingredientService: IngredientService;
  private voteService: VoteService;

  constructor(
    recipeRepository: RecipeRepository,
    userService: UserService,
    areaService: AreaService,
    categoryService: CategoryService,
    ingredientService: IngredientService,
    voteService: VoteService
  ) {
    this.recipeRepository = recipeRepository;
    this.userService = userService;
    this.areaService = areaService;
    this.categoryService = categoryService;
    this.ingredientService = ingredientService;
    this.voteService = voteService;
  }

  async createRecipe(data: {
    name: string;
    description: string;
    userId: number;
    areaId: number;
    categoryIds: number[];
    thumbnailImages?: Buffer[];
    steps?: { order: number; description: string; images?: Buffer[] }[];
    recipeIngredients?: { ingredientId: number; order: number; quantity: number; unit: string }[];
  }): Promise<Recipe> {
    // Validate user, area, and categories
    const user = await this.userService.getUserById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const area = await this.areaService.getAreaById(data.areaId);
    if (!area) {
      throw new Error('Area not found');
    }

    // Validate all categories exist
    const categories = [];
    for (const categoryId of data.categoryIds) {
      const category = await this.categoryService.getCategoryById(categoryId);
      if (!category) {
        throw new Error(`Category with id ${categoryId} not found`);
      }
      categories.push(category);
    }

    // Build complete recipe object with nested entities
    const recipe = new Recipe();
    recipe.name = data.name;
    recipe.description = data.description;
    recipe.user = user;
    recipe.area = area;
    recipe.categories = categories;

    // Upload thumbnails and create attachment objects
    recipe.thumbnails = [];
    if (data.thumbnailImages && data.thumbnailImages.length > 0) {
      for (const buffer of data.thumbnailImages) {
        const uploadResult = await uploadImage(buffer, 'cookpac/recipes');
        const attachment = new Attachment(uploadResult.public_id, uploadResult.secure_url);
        recipe.thumbnails.push(attachment);
      }
    }

    // Create steps with attachments
    recipe.steps = [];
    if (data.steps && data.steps.length > 0) {
      for (const stepData of data.steps) {
        const step = new Step();
        step.order = stepData.order;
        step.description = stepData.description;
        
        // Upload step images and create attachment objects
        step.attachments = [];
        if (stepData.images && stepData.images.length > 0) {
          for (const buffer of stepData.images) {
            const uploadResult = await uploadImage(buffer, 'cookpac/steps');
            const attachment = new Attachment(uploadResult.public_id, uploadResult.secure_url);
            step.attachments.push(attachment);
          }
        }
        recipe.steps.push(step);
      }
    }

    // Create recipe ingredients
    recipe.recipeIngredients = [];
    if (data.recipeIngredients && data.recipeIngredients.length > 0) {
      for (const riData of data.recipeIngredients) {
        const ingredient = await this.ingredientService.getIngredientById(riData.ingredientId);
        if (!ingredient) {
          throw new Error(`Ingredient with id ${riData.ingredientId} not found`);
        }

        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.order = riData.order;
        recipeIngredient.quantity = riData.quantity;
        recipeIngredient.unit = riData.unit;
        recipeIngredient.ingredient = ingredient;
        recipe.recipeIngredients.push(recipeIngredient);
      }
    }

    // Save recipe - cascade will save all nested entities
    const savedRecipe = await this.recipeRepository.save(recipe);
    return this.recipeRepository.findById(savedRecipe.id) as Promise<Recipe>;
  }

  async getRecipeById(id: number): Promise<any | null> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      return null;
    }

    // Extract voted user IDs
    const votedUserIds = recipe.votes ? recipe.votes.map(vote => vote.user.id) : [];

    // Return recipe with votedUserIds
    const { votes, ...recipeData } = recipe;
    return {
      ...recipeData,
      votedUserIds,
    };
  }

  async getAllRecipes(page: number = 1, pageSize: number = 10) {
    const { recipes, total } = await this.recipeRepository.findAll(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      recipes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async updateRecipe(id: number, data: {
    name?: string;
    description?: string;
    areaId?: number;
    categoryIds?: number[];
    thumbnailImages?: Buffer[];
    steps?: { order: number; description: string; images?: Buffer[] }[];
    recipeIngredients?: { ingredientId: number; order: number; quantity: number; unit: string }[];
  }): Promise<Recipe | null> {
    // Get existing recipe
    const existingRecipe = await this.recipeRepository.findById(id);
    if (!existingRecipe) {
      return null;
    }

    // Delete old attachments from Cloudinary
    const oldAttachments = await this.recipeRepository.getAllAttachments(id);
    if (oldAttachments.length > 0) {
      const publicIds = oldAttachments.map(att => att.publicId);
      try {
        await deleteImages(publicIds);
      } catch (error) {
        console.error('Error deleting old images from Cloudinary:', error);
      }
      // Delete attachments from database
      await this.recipeRepository.deleteAttachments(oldAttachments.map(att => att.id));
    }

    // Update basic fields
    if (data.name !== undefined) existingRecipe.name = data.name;
    if (data.description !== undefined) existingRecipe.description = data.description;

    // Update area
    if (data.areaId !== undefined) {
      const area = await this.areaService.getAreaById(data.areaId);
      if (!area) {
        throw new Error('Area not found');
      }
      existingRecipe.area = area;
    }

    // Update categories
    if (data.categoryIds !== undefined) {
      const categories = [];
      for (const categoryId of data.categoryIds) {
        const category = await this.categoryService.getCategoryById(categoryId);
        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }
        categories.push(category);
      }
      existingRecipe.categories = categories;
    }

    // Upload new thumbnails
    if (data.thumbnailImages !== undefined) {
      existingRecipe.thumbnails = [];
      for (const buffer of data.thumbnailImages) {
        const uploadResult = await uploadImage(buffer, 'cookpac/recipes');
        const attachment = new Attachment(uploadResult.public_id, uploadResult.secure_url);
        existingRecipe.thumbnails.push(attachment);
      }
    }

    // Create new steps with attachments
    if (data.steps !== undefined) {
      existingRecipe.steps = [];
      for (const stepData of data.steps) {
        const step = new Step();
        step.order = stepData.order;
        step.description = stepData.description;

        // Upload step images
        step.attachments = [];
        if (stepData.images && stepData.images.length > 0) {
          for (const buffer of stepData.images) {
            const uploadResult = await uploadImage(buffer, 'cookpac/steps');
            const attachment = new Attachment(uploadResult.public_id, uploadResult.secure_url);
            step.attachments.push(attachment);
          }
        }
        existingRecipe.steps.push(step);
      }
    }

    // Create new recipe ingredients
    if (data.recipeIngredients !== undefined) {
      existingRecipe.recipeIngredients = [];
      for (const riData of data.recipeIngredients) {
        const ingredient = await this.ingredientService.getIngredientById(riData.ingredientId);
        if (!ingredient) {
          throw new Error(`Ingredient with id ${riData.ingredientId} not found`);
        }

        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.order = riData.order;
        recipeIngredient.quantity = riData.quantity;
        recipeIngredient.unit = riData.unit;
        recipeIngredient.ingredient = ingredient;
        existingRecipe.recipeIngredients.push(recipeIngredient);
      }
    }

    // Save updated recipe - cascade will save all nested entities
    await this.recipeRepository.save(existingRecipe);
    return this.recipeRepository.findById(id);
  }

  async deleteRecipe(id: number): Promise<void> {
    // Delete all attachments from Cloudinary first
    const attachments = await this.recipeRepository.getAllAttachments(id);
    if (attachments.length > 0) {
      const publicIds = attachments.map(att => att.publicId);
      try {
        await deleteImages(publicIds);
      } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
      }
    }

    // Delete recipe from database (cascade will handle related records)
    const deleted = await this.recipeRepository.delete(id);
    
    if (!deleted) {
      throw new Error('Recipe not found');
    }
  }

  async filterRecipes(filters: {
    ingredientIds?: number[];
    categoryIds?: number[];
    areaIds?: number[];
    page?: number;
    pageSize?: number;
  }): Promise<{ recipes: Recipe[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    const { recipes, total } = await this.recipeRepository.filterRecipes({
      ingredientIds: filters.ingredientIds,
      categoryIds: filters.categoryIds,
      areaIds: filters.areaIds,
      page,
      pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      recipes,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUserRecipes(userId: number, page: number = 1, pageSize: number = 10) {
    const { recipes, total } = await this.recipeRepository.findUserRecipes(userId, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      recipes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getUserRecipesCount(userId: number): Promise<number> {
    return this.recipeRepository.countUserRecipes(userId);
  }

  async getUserVotedRecipes(userId: number, page: number = 1, pageSize: number = 10) {
    const { recipes, total } = await this.recipeRepository.findUserVotedRecipes(userId, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      recipes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async voteRecipe(recipeId: number, userId: number): Promise<void> {
    // Check if recipe exists
    const recipe = await this.recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Delegate to vote service
    await this.voteService.addVote(userId, recipe);
  }

  async unvoteRecipe(recipeId: number, userId: number): Promise<void> {
    // Check if recipe exists
    const recipe = await this.recipeRepository.findById(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Delegate to vote service
    await this.voteService.removeVote(userId, recipeId);
  }
}
