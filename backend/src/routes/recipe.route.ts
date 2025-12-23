// Recipe route
import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { AreaService } from '../services/area.service';
import { CategoryService } from '../services/category.service';
import { IngredientService } from '../services/ingredient.service';
import { VoteService } from '../services/vote.service';
import { RecipeRepository } from '../repositories/recipe.repository';
import { UserRepository } from '../repositories/user.repository';
import { AreaRepository } from '../repositories/area.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { VoteRepository } from '../repositories/vote.repository';
import { AppDataSource } from '../data-source';

// Initialize repositories
const recipeRepository = new RecipeRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);
const areaRepository = new AreaRepository(AppDataSource);
const categoryRepository = new CategoryRepository(AppDataSource);
const ingredientRepository = new IngredientRepository(AppDataSource);
const voteRepository = new VoteRepository(AppDataSource);

// Initialize services
const userService = new UserService(userRepository);
const areaService = new AreaService(areaRepository);
const categoryService = new CategoryService(categoryRepository);
const ingredientService = new IngredientService(ingredientRepository);
const voteService = new VoteService(voteRepository, userService);
const recipeService = new RecipeService(recipeRepository, userService, areaService, categoryService, ingredientService, voteService);

// Initialize controller
const recipeController = new RecipeController(recipeService);

// Define routes
const recipeRouter = Router();

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Creates a recipe with steps, ingredients, thumbnails, and attachments. User ID is hardcoded to 1.
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - areaId
 *               - categoryIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the recipe
 *                 example: Spaghetti Carbonara
 *               description:
 *                 type: string
 *                 description: Recipe description
 *                 example: Classic Italian pasta dish
 *               areaId:
 *                 type: integer
 *                 description: ID of the area (cuisine type)
 *                 example: 1
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of category IDs
 *                 example: [1, 2]
 *               thumbnailImages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       format: byte
 *                       description: Base64 encoded image data
 *                       example: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
 *                 description: Recipe thumbnail images (base64 encoded)
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: integer
 *                       description: Step order in the recipe
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: Boil water and cook pasta
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data:
 *                             type: string
 *                             format: byte
 *                             description: Base64 encoded image data
 *                       description: Step illustration images (base64 encoded)
 *                 description: Step-by-step instructions with images (ordered)
 *               recipeIngredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId:
 *                       type: integer
 *                       example: 1
 *                     order:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: number
 *                       format: float
 *                       example: 200
 *                     unit:
 *                       type: string
 *                       example: grams
 *                 description: List of ingredients with quantities
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Bad request - Validation error or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.post('/', (req, res) => recipeController.createRecipe(req, res));

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes with pagination
 *     description: Returns a list of all recipes with basic information and pagination
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recipes per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           description: Total number of recipes
 *                           example: 100
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.get('/', (req, res) => recipeController.getAllRecipes(req, res));

/**
 * @swagger
 * /api/recipes/filter:
 *   get:
 *     summary: Filter recipes by ingredients, categories, and areas
 *     description: Returns recipes that match the filter criteria with pagination. All filters use OR logic (recipes matching at least one of the specified IDs). Provide IDs as comma-separated values.
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recipes per page
 *         example: 10
 *       - in: query
 *         name: ingredientIds
 *         schema:
 *           type: string
 *         description: Comma-separated ingredient IDs. Filter recipes that use at least one of these ingredients.
 *         example: "1,2,3"
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs. Filter recipes that belong to at least one of these categories.
 *         example: "1,2"
 *       - in: query
 *         name: areaIds
 *         schema:
 *           type: string
 *         description: Comma-separated area IDs. Filter recipes that belong to one of these areas.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Recipes filtered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           description: Total number of recipes matching the filter
 *                           example: 45
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 5
 *       400:
 *         description: Bad request - Invalid filter parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.get('/filter', (req, res) => recipeController.filterRecipes(req, res));

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     description: Returns full recipe details including steps, ingredients, thumbnails, attachments, and array of user IDs who voted
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Recipe found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Recipe'
 *                     - type: object
 *                       properties:
 *                         votedUserIds:
 *                           type: array
 *                           items:
 *                             type: integer
 *                           description: Array of user IDs who voted for this recipe
 *                           example: [1, 2, 5]
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.get('/:id', (req, res) => recipeController.getRecipe(req, res));

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update recipe by ID
 *     description: Updates recipe information. Provide oldThumbnailPublicIds and oldStepAttachmentPublicIds to delete old images from Cloudinary when replacing them.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the recipe
 *                 example: Spaghetti Carbonara (Updated)
 *               description:
 *                 type: string
 *                 description: Updated recipe description
 *                 example: Classic Italian pasta dish with eggs and bacon
 *               areaId:
 *                 type: integer
 *                 description: Updated area ID
 *                 example: 1
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Updated array of category IDs
 *                 example: [1, 3]
 *               thumbnailImages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       format: byte
 *                       description: Base64 encoded image data
 *                 description: Updated recipe thumbnails (base64 encoded). Providing this will replace all existing thumbnails.
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: integer
 *                       description: Step order in the recipe
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: Cook pasta al dente
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data:
 *                             type: string
 *                             format: byte
 *                             description: Base64 encoded image data
 *                 description: Updated steps with images (base64 encoded, ordered). Providing this will replace all existing steps.
 *               recipeIngredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId:
 *                       type: integer
 *                     order:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                       format: float
 *                     unit:
 *                       type: string
 *                 description: Updated ingredients list
 *     responses:
 *       200:
 *         description: Recipe updated successfully. Old images are automatically deleted from Cloudinary when replaced.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.put('/:id', (req, res) => recipeController.updateRecipe(req, res));

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete recipe by ID
 *     description: Deletes the recipe from database (cascading all related data) and removes all associated images from Cloudinary
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *         example: 1
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.delete('/:id', (req, res) => recipeController.deleteRecipe(req, res));

/**
 * @swagger
 * /api/recipes/{id}/vote:
 *   post:
 *     summary: Vote for a recipe
 *     description: Adds a vote from the authenticated user (currently hardcoded as user ID 1) to the specified recipe. Users can only vote once per recipe.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Vote added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Vote added successfully
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - User has already voted for this recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User has already voted for this recipe
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.post('/:id/vote', (req, res) => recipeController.voteRecipe(req, res));

/**
 * @swagger
 * /api/recipes/{id}/unvote:
 *   delete:
 *     summary: Remove vote from a recipe
 *     description: Removes the vote from the authenticated user (currently hardcoded as user ID 1) for the specified recipe. User must have previously voted for this recipe.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Recipe ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Vote removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Vote removed successfully
 *       404:
 *         description: Recipe not found or user has not voted for this recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User has not voted for this recipe
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
recipeRouter.delete('/:id/unvote', (req, res) => recipeController.unvoteRecipe(req, res));

export default recipeRouter;
