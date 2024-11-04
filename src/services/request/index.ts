import { RequestService } from './request-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const requestService: RequestService = new RequestService(httpClient);
