import { SummaryService } from './summary-service.ts';
import {httpClient} from "../../config/http/http.ts";

console.log('[SummaryService] index');

export const summaryService: SummaryService = new SummaryService(httpClient);
