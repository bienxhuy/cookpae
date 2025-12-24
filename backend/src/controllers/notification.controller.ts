import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // Get all notifications for the authenticated user
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.sub; // Get user ID from JWT payload
      const limit = parseInt(req.query.limit as string) || 50;

      const notifications = await this.notificationService.getUserNotifications(userId, limit);
      
      res.json({
        status: 'success',
        data: notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  // Get unread notifications count
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.sub;

      const count = await this.notificationService.getUnreadCount(userId);
      
      res.json({
        status: 'success',
        data: { count },
      });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  // Mark a notification as read
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const notificationId = parseInt(req.params.id, 10);

      await this.notificationService.markAsRead(notificationId);
      
      res.json({
        status: 'success',
        message: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  // Mark all notifications as read
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.sub;

      await this.notificationService.markAllAsRead(userId);
      
      res.json({
        status: 'success',
        message: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  // Delete a notification
  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationId = parseInt(req.params.id, 10);

      await this.notificationService.deleteNotification(notificationId);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
}
