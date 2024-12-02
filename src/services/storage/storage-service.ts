import {HttpClient, HttpRequestError, HttpRequestResponse} from '@getinsight.it/getinsight-common';
import { STORAGE_API } from './storage-api.ts';
import { StorageDTO } from './storage-dto.ts';
import {PaginatedResponse} from "../../lib/paginated-response.ts";

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
  ): Promise<PaginatedResponse<StorageDTO> | null> {
    const queryParams = new URLSearchParams({
      ownerId: ownerId,
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      sortField: sortField,
      sortType: sortType
    });

    if (ownerId) {
      queryParams.append('ownerId', ownerId);
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${STORAGE_API.PAGINATED}?${queryParams.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<StorageDTO>;
    } else {
      console.error('Erro ao buscar storages paginados');
    }

    return null;
  }

}
