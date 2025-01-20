import { NotificationService } from './notification-service.ts';
import {httpClient} from "../../config/http/http.ts";

console.log('[NotificationService] index');

export const notificationService: NotificationService = new NotificationService(httpClient);
