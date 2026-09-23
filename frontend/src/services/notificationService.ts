import { api } from "./api";

export type Notification = {
  id: string;
  recipientId: string;
  recipientRole: string;
  type: string;
  title: string;
  body?: string;
  data?: string;
  isRead: boolean;
  createdAt: string;
};

export type UnreadCountResponse = {
  count: number;
};

export const notificationService = {
  async list(): Promise<{ notifications: Notification[] }> {
    const { data } = await api.get("/notifications");
    return data;
  },

  async unreadCount(): Promise<UnreadCountResponse> {
    const { data } = await api.get("/notifications/unread-count");
    return data;
  },

  async markAsRead(id: string): Promise<{ notification: Notification }> {
    const { data } = await api.post(`/notifications/${id}/read`);
    return data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const { data } = await api.post("/notifications/mark-all-read");
    return data;
  },
};
