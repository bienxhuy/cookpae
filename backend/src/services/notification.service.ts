import { NotificationRepository } from '../repositories/notification.repository';
import { UserService } from './user.service';
import { Notification } from '../entities/Notification';

export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private userService: UserService
  ) {}

  async createNotification(
    userId: number,
    content: string,
    link: string
  ): Promise<Notification> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.notificationRepository.create(content, link, user);
  }

  async getUserNotifications(userId: number, limit?: number): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId, limit);
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.findUnreadByUserId(userId);
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.deleteById(notificationId);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.countUnread(userId);
  }
}
