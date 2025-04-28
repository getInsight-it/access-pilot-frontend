import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { StorageModel } from "../model/storage.model.ts";
import { PaginatedResponse } from "../../../../common/types/util/paginated-response.ts";
import { httpClient } from "../../../../config/http/http.ts";

export const STORAGE_API = {
  PAGINATED: "/v1/storages/paginated",
  DOWNLOAD: "/v1/storages/download"
};

export class StorageService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getStoragesPaginated(
    ownerId: string,
    pageIndex: number,
    pageSize: number,
    sortField: string,
    sortType: string
  ): Promise<PaginatedResponse<StorageModel> | null> {
    const queryParams = new URLSearchParams({
      ownerId: ownerId,
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if(ownerId) {
      queryParams.append("ownerId", ownerId);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${STORAGE_API.PAGINATED}?${queryParams.toString()}`);

    if(response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<StorageModel>;
    } else {
      console.error("Erro ao buscar storages paginados");
    }

    return null;
  }
}

export const storageService: StorageService = new StorageService(httpClient);
