import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { SummaryModel } from "../model/summary.model.ts";
import { httpClient } from "../../../../config/http/http.ts";

export const SUMMARY_API = {
  SUMMARIES: "/v1/summaries"
};

export class SummaryService {

  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getSummary(): Promise<SummaryModel> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get<SummaryModel>(SUMMARY_API.SUMMARIES);

    if(response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error("Deu ruim!");
    }
    return {} as SummaryModel;
  }
}

export const summaryService: SummaryService = new SummaryService(httpClient);
