/**
 * Notification model representing a user notification
 */
export interface NotificationModel {
  id: number;
  uuid: string;
  title: string;
  description: string;
  isOpened: boolean;
  type: string;
  lastModified: string;
  requestId: number;
  priority: number;
}
