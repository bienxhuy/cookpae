// Area route
import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { AreaService } from '../services/area.service';
import { AreaRepository } from '../repositories/area.repository';
import { AppDataSource } from '../data-source';

// Initialize repository, service, and controller using dependency injection
const areaRepository = new AreaRepository(AppDataSource);
const areaService = new AreaService(areaRepository);
const areaController = new AreaController(areaService);

// Define routes
const areaRouter = Router();

/**
 * @swagger
 * /api/areas:
 *   post:
 *     summary: Create a new area
 *     tags: [Areas]
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
 *                 description: The name of the area
 *                 example: Italian
 *     responses:
 *       201:
 *         description: Area created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Area'
 *       400:
 *         description: Bad request - Name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Area name already exists
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
areaRouter.post('/', (req, res) => areaController.createArea(req, res));

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Get area by ID
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Area ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Area found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Area'
 *       404:
 *         description: Area not found
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
areaRouter.get('/:id', (req, res) => areaController.getArea(req, res));

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *     summary: Update area by ID
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Area ID
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
 *                 description: The new name of the area
 *                 example: French
 *     responses:
 *       200:
 *         description: Area updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Area'
 *       400:
 *         description: Bad request - Name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Area not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - Area name already exists
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
areaRouter.put('/:id', (req, res) => areaController.updateArea(req, res));

/**
 * @swagger
 * /api/areas/{id}/activate:
 *   patch:
 *     summary: Activate area by ID
 *     description: Sets the isActive field to true, allowing the area to be used in the application
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Area ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Area activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Area'
 *       404:
 *         description: Area not found
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
areaRouter.patch('/:id/activate', (req, res) => areaController.activateArea(req, res));

/**
 * @swagger
 * /api/areas/{id}/deactivate:
 *   patch:
 *     summary: Deactivate area by ID
 *     description: Sets the isActive field to false, soft deleting the area from the business layer without removing it from the database
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Area ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Area deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Area'
 *       404:
 *         description: Area not found
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
areaRouter.patch('/:id/deactivate', (req, res) => areaController.deactivateArea(req, res));

export default areaRouter;
