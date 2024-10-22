import {ClientService} from './client-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const clientService: ClientService = new ClientService(httpClient);
