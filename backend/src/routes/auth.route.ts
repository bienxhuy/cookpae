import { Router } from "express";
import { AppDataSource } from "../data-source";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Initialize repositories
const userRepository = new UserRepository(AppDataSource);
const refreshTokenRepository = new RefreshTokenRepository(AppDataSource);

// Initialize service
const authService = new AuthService(userRepository, refreshTokenRepository);

// Initialize controller
const authController = new AuthController(authService);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout successful
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logged out from all devices
 *       401:
 *         description: Unauthorized
 */
router.post("/logout-all", authenticate(authService), authController.logoutAll);

export default router;
