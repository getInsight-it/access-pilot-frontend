import { RoleService } from './role-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const roleService: RoleService = new RoleService(httpClient);
