import { HttpClient } from '@getinsight.it/getinsight-common';
import { authService } from '../../services/auth';

const httpClient: HttpClient = new HttpClient(window.env.API_URL);

const registerHttpAuthorization = async (isAuthenticated: boolean): Promise<void> => {
  if (isAuthenticated) {
    const token: string = await authService.getBearerToken() as string;

    if (token) {
      httpClient.addBearerAuthorization(token);
    }
  }
};

export { httpClient, registerHttpAuthorization };
