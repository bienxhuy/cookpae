import axios from '@/lib/axios';

export interface Notification {
  id: number;
  content: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (limit: number = 50): Promise<Notification[]> => {
  const response = await axios.get(`/api/notifications?limit=${limit}`);
  return response.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await axios.get('/api/notifications/unread-count');
  return response.data.data.count;
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await axios.put(`/api/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axios.put('/api/notifications/read-all');
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  await axios.delete(`/api/notifications/${notificationId}`);
};
