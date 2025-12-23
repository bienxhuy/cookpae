// Ingredient route
import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient.controller';
import { IngredientService } from '../services/ingredient.service';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { AppDataSource } from '../data-source';

// Initialize repository, service, and controller using dependency injection
const ingredientRepository = new IngredientRepository(AppDataSource);
const ingredientService = new IngredientService(ingredientRepository);
const ingredientController = new IngredientController(ingredientService);

// Define routes
const ingredientRouter = Router();

/**
 * @swagger
 * /api/ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the ingredient
 *                 example: Tomato
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Bad request - Name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Ingredient name already exists
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
ingredientRouter.post('/', (req, res) => ingredientController.createIngredient(req, res));

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     summary: Get all ingredients with pagination
 *     tags: [Ingredients]
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
 *         description: Number of ingredients per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Ingredients retrieved successfully
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
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ingredient'
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
 *                           description: Total number of ingredients
 *                           example: 150
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 15
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
ingredientRouter.get('/', (req, res) => ingredientController.getAllIngredients(req, res));

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Ingredient found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Ingredient not found
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
ingredientRouter.get('/:id', (req, res) => ingredientController.getIngredient(req, res));

/**
 * @swagger
 * /api/ingredients/{id}:
 *   put:
 *     summary: Update ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the ingredient
 *                 example: Cherry Tomato
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Bad request - Name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ingredient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Ingredient name already exists
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
ingredientRouter.put('/:id', (req, res) => ingredientController.updateIngredient(req, res));

export default ingredientRouter;
