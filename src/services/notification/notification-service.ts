import {HttpClient, HttpRequestError, HttpRequestResponse} from "@getinsight.it/getinsight-common";
import {NOTIFICATION_API} from "./notification-api.ts";
import {NotificationDto} from "./notification-dto.ts";
import {REQUEST_API} from "../../features/requests/common/types/request.enum.ts";
import {PaginatedResponse} from "../../lib/paginated-response.ts";
import {RequestModel} from "../../features/requests/common/types/request.model.ts";
import {ClientDTO} from "../client/client-dto.ts";
import {NotificationSummaryDto} from "./notification-summary-dto.ts";

export class NotificationService {

  httpClient: HttpClient;

  private constructor(httpClient: HttpClient) {
    console.log('[httpClient] constructor');
    this.httpClient = httpClient;
  }


  async getNotifications(
    type: string,
    pageIndex: number,
    pageSize: number,
    sortField: "id",
    sortType: "DESC",
    userId: string | undefined
  ): Promise<PaginatedResponse<NotificationDto>> {
    const queryParams = new URLSearchParams();
    queryParams.append('type', type);
    queryParams.append('pageIndex', pageIndex.toString());
    queryParams.append('pageSize', pageSize.toString());
    queryParams.append('sortField', sortField);
    queryParams.append('sortType', sortType);
    queryParams.append('externalId', userId);


    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${NOTIFICATION_API.NOTIFICATIONS}?${queryParams?.toString()}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as PaginatedResponse<NotificationDto>;
    } else {
      console.error('Deu ruim!');
    }
    return {} as PaginatedResponse<NotificationDto>;

  }

  async updateOpenNotification (notificationId: number, isOpened: boolean): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(NOTIFICATION_API.NOTIFICATIONS_OPENED.replace(':id', notificationId.toString()), { isOpened, type : 'web' });

    if (response instanceof HttpRequestResponse) {
      return;
    } else {
      console.error('Deu ruim!');
    }
  }

  async getSummaryNotifications(externalId : string, type :string): Promise<NotificationSummaryDto> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${NOTIFICATION_API.NOTIFICATIONS_SUMMARY}?externalId=${externalId}&type=${type}`);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data) as NotificationSummaryDto;
    } else {
      console.error('Deu ruim!');
    }
    return {} as NotificationSummaryDto;
  }


}
