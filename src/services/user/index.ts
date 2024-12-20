import { UserService } from './user-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const userService: UserService = new UserService(httpClient);
