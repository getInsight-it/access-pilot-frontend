export interface NotificationDto {
  id: number;
  uuid: string;
  title: string;
  description: string;
  isOpen: boolean;
  type: string;
  ultimaAlteracao: string;
  requestId: number;
  priority: number;
}
