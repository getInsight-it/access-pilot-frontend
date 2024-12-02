import { StorageService } from './storage-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const storageService: StorageService = new StorageService(httpClient);
