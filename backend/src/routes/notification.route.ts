import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { UserRepository } from '../repositories/user.repository';
import { AppDataSource } from '../data-source';
import { authenticate } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';

// Initialize repositories
const notificationRepository = new NotificationRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);
const refreshTokenRepository = new RefreshTokenRepository(AppDataSource);

// Initialize services
const userService = new UserService(userRepository);
const notificationService = new NotificationService(notificationRepository, userService);
const authService = new AuthService(userRepository, refreshTokenRepository);

// Initialize controller
const notificationController = new NotificationController(notificationService);

// Define routes
const notificationRouter = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for authenticated user
 *     description: Returns list of notifications with pagination
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of notifications to return
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
notificationRouter.get('/', authenticate(authService), (req, res) => 
  notificationController.getNotifications(req, res)
);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     description: Returns the count of unread notifications for authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
notificationRouter.get('/unread-count', authenticate(authService), (req, res) => 
  notificationController.getUnreadCount(req, res)
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Marks a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 */
notificationRouter.put('/:id/read', authenticate(authService), (req, res) => 
  notificationController.markAsRead(req, res)
);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Marks all notifications as read for authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
notificationRouter.put('/read-all', authenticate(authService), (req, res) => 
  notificationController.markAllAsRead(req, res)
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     description: Deletes a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 */
notificationRouter.delete('/:id', authenticate(authService), (req, res) => 
  notificationController.deleteNotification(req, res)
);

export default notificationRouter;
