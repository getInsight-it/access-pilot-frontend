import {HttpClient, HttpRequestError, HttpRequestResponse} from "@getinsight.it/getinsight-common";
import {SUMMARY_API} from "./summary-api.ts";
import {SummaryDto} from "./summary-dto.ts";

export class SummaryService {

  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    console.log('[httpClient] constructor');
    this.httpClient = httpClient;
  }


  async getSummary(): Promise<SummaryDto> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get<SummaryDto>(SUMMARY_API.SUMMARIES);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error('Deu ruim!');
    }
    return {} as SummaryDto;
  }


}
