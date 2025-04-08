import { LevelService } from './level-service.ts';
import { httpClient } from '../../config/http/http.ts';

export const levelService: LevelService = new LevelService(httpClient);
