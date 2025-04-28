import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { AUTH_ROUTES } from "../../common/constants/routes.ts";
import { authService } from "../../features/auth/common/AuthService.ts";

const httpClient: HttpClient = new HttpClient(window.env.API_URL);

const registerHttpAuthorization = async (isAuthenticated: boolean): Promise<void> => {
  if(isAuthenticated) {
    const token: string = await authService.getBearerToken() as string;

    if(token) {
      httpClient.addBearerAuthorization(token);
    }
  }
};

const originalMakeRequest = httpClient["makeRequest"];
httpClient["makeRequest"] = async function(...args: any[]) {
  try {
    const response: HttpRequestResponse | HttpRequestError = await originalMakeRequest.apply(this, args);
    return response;
  } catch (error) {
    if(error instanceof HttpRequestError && error.status === 401) {
      window.location.href = AUTH_ROUTES.LOGIN;
    }
    console.error("Erro ao fazer requisição:", error);
    return error;
  }
};

export { httpClient, registerHttpAuthorization };
