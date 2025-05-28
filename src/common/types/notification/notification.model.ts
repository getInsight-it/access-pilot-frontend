export interface NotificationModel {
  id: number;
  uuid: string;
  title: string;
  description: string;
  isOpened: boolean;
  type: string;
  ultimaAlteracao: string;
  requestId: number;
  priority: number;
}
