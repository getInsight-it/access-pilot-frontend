import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { NotificationModel } from "../types/notification/notification.model.ts";
import { PaginatedResponse } from "../types/util/paginated-response.ts";
import { httpClient } from "../../config/http/http.ts";

const NOTIFICATION_API = {
  NOTIFICATIONS: "/v1/notifications",
  NOTIFICATIONS_OPENED: "/v1/notifications/:id/opened",
  NOTIFICATIONS_SUMMARY: "/v1/notifications/summary"
};

export class NotificationService {

  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getNotifications(
    type: string,
    pageIndex: number,
    pageSize: number,
    sortField: "id",
    sortType: "DESC",
    userId: string | undefined
  ): Promise<PaginatedResponse<NotificationModel>> {
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);
    queryParams.append("pageIndex", pageIndex.toString());
    queryParams.append("pageSize", pageSize.toString());
    queryParams.append("sortField", sortField);
    queryParams.append("sortType", sortType);
    queryParams.append("externalId", userId ?? "");

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${NOTIFICATION_API.NOTIFICATIONS}?${queryParams.toString()}`);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as PaginatedResponse<NotificationModel>;
  }

  /**
   * Updates the opened status of a notification
   *
   * @param notificationId - ID of the notification to update
   * @param isOpened - Whether the notification has been opened
   * @throws {HttpRequestError} If the request fails
   */
  async updateOpenNotification(notificationId: number, isOpened: boolean): Promise<void> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(
      NOTIFICATION_API.NOTIFICATIONS_OPENED.replace(":id", notificationId.toString()),
      {
        isOpened,
        type: "web"
      }
    );

    if(response instanceof HttpRequestError) {
      throw response;
    }
  }
}

export const notificationService: NotificationService = new NotificationService(httpClient);
