import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { UserModel } from "../types/user/user.model.ts";
import { httpClient } from "../../config/http/http.ts";

export const USER_API = {
  USER: "/v1/users/me"
};

export class UserService {

  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getUser(): Promise<UserModel | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(USER_API.USER);

    if(response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as UserModel;
  }
}

export const userService: UserService = new UserService(httpClient);
