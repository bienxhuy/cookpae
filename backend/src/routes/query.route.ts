import { Router } from 'express';
import { RecipeQueryController } from '../controllers/query.controller';
import { RecipeQueryService } from '../services/AI/recipe-query.service';
import { EmbeddingService } from '../services/AI/embedding.service';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { AreaService } from '../services/area.service';
import { CategoryService } from '../services/category.service';
import { IngredientService } from '../services/ingredient.service';
import { VoteService } from '../services/vote.service';

import { DocumentRepository } from '../repositories/document.repository';
import { RecipeRepository } from '../repositories/recipe.repository';
import { UserRepository } from '../repositories/user.repository';
import { AreaRepository } from '../repositories/area.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { IngredientRepository } from '../repositories/ingredient.repository';
import { VoteRepository } from '../repositories/vote.repository';

import { AppDataSource } from '../data-source';

// Initialize repositories
const documentRepository = new DocumentRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);
const areaRepository = new AreaRepository(AppDataSource);
const categoryRepository = new CategoryRepository(AppDataSource);
const ingredientRepository = new IngredientRepository(AppDataSource);
const recipeRepository = new RecipeRepository(AppDataSource);
const voteRepository = new VoteRepository(AppDataSource);

// Initialize dependent services (exactly like in recipe.route.ts)
const userService = new UserService(userRepository);
const areaService = new AreaService(areaRepository);
const categoryService = new CategoryService(categoryRepository);
const ingredientService = new IngredientService(ingredientRepository);
const voteService = new VoteService(voteRepository, userService);

// Initialize core services
const embeddingService = new EmbeddingService(documentRepository);
const recipeService = new RecipeService(
  recipeRepository,
  userService,
  areaService,
  categoryService,
  ingredientService,
  voteService
);

// Initialize AI service and controller
const recipeQueryService = new RecipeQueryService(embeddingService, recipeService);
const recipeQueryController = new RecipeQueryController(recipeQueryService);

// Define routes
const queryRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: AI Query
 *     description: Các endpoint sử dụng AI (Groq + RAG) để truy vấn và tạo công thức nấu ăn từ ngôn ngữ tự nhiên
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QueryRequest:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         prompt:
 *           type: string
 *           description: Câu hỏi hoặc yêu cầu bằng ngôn ngữ tự nhiên của người dùng
 *           example: "Cho mình công thức làm phở bò ngon mà không cần quá nhiều gia vị đi"
 *     QueryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             answer:
 *               type: string
 *               description: Công thức hoàn chỉnh hoặc câu trả lời từ AI
 *             recipeId:
 *               type: integer
 *               nullable: true
 *               description: ID công thức nếu AI sử dụng công thức có sẵn trong database
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Thiếu prompt"
 */

/**
 * @swagger
 * /api/query/natural:
 *   post:
 *     summary: Truy vấn công thức nấu ăn bằng ngôn ngữ tự nhiên
 *     description: |
 *       Người dùng gửi một câu hỏi/yêu cầu bằng tiếng Việt.
 *       Hệ thống sử dụng RAG (từ tài liệu đã upload) + Groq AI + công thức có sẵn trong database
 *       để trả về công thức phù hợp nhất hoặc tạo mới.
 *     tags: [AI Query]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QueryRequest'
 *     responses:
 *       200:
 *         description: Trả về công thức từ AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QueryResponse'
 *       400:
 *         description: Thiếu hoặc prompt không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Lỗi server hoặc lỗi từ AI
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
queryRouter.post('/natural', (req, res) => recipeQueryController.query(req, res));

export default queryRouter;