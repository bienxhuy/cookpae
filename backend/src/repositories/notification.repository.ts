import { DataSource, Repository } from 'typeorm';
import { Notification } from '../entities/Notification';
import { User } from '../entities/User';

export class NotificationRepository {
  private repository: Repository<Notification>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Notification);
  }

  async create(content: string, link: string, user: User): Promise<Notification> {
    const notification = new Notification(content, link, user);
    return await this.repository.save(notification);
  }

  async findByUserId(userId: number, limit: number = 50): Promise<Notification[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findUnreadByUserId(userId: number): Promise<Notification[]> {
    return await this.repository.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.repository.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.repository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true }
    );
  }

  async deleteById(notificationId: number): Promise<void> {
    await this.repository.delete(notificationId);
  }

  async countUnread(userId: number): Promise<number> {
    return await this.repository.count({
      where: { user: { id: userId }, isRead: false },
    });
  }
}
