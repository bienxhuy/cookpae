// Recipe route
import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { UserController } from '../controllers/user.controller';

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
const userController = new UserController(userService, recipeService);

// Define routes
// TODO: Add authentication middleware 
const userRouter = Router();

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/:id', (req, res) => userController.getUser(req, res));

/**
 * @swagger
 * /api/users/{id}/recipes:
 *   get:
 *     summary: Get all recipes created by user
 *     description: Returns a paginated list of all recipes created by the specified user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
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
 *                           description: Total number of recipes created by user
 *                           example: 25
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 3
 *       404:
 *         description: User not found
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
userRouter.get('/:id/recipes', (req, res) => userController.getUserRecipes(req, res));

/**
 * @swagger
 * /api/users/{id}/recipes/count:
 *   get:
 *     summary: Get total number of recipes created by user
 *     description: Returns the total count of recipes created by the specified user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Recipe count retrieved successfully
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
 *                     count:
 *                       type: integer
 *                       description: Total number of recipes created by user
 *                       example: 25
 *       404:
 *         description: User not found
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
userRouter.get('/:id/recipes/count', (req, res) => userController.getUserRecipesCount(req, res));

/**
 * @swagger
 * /api/users/{id}/recipes/voted:
 *   get:
 *     summary: Get all recipes voted by user
 *     description: Returns a paginated list of all recipes that the user has voted for
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
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
 *         description: Voted recipes retrieved successfully
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
 *                           description: Total number of recipes voted by user
 *                           example: 15
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 2
 *       404:
 *         description: User not found
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
userRouter.get('/:id/recipes/voted', (req, res) => userController.getUserVotedRecipes(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default userRouter;
