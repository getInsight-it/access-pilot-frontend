import { RequestService } from './request-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const roleService: RequestService = new RequestService(httpClient);
