import { HttpClient } from '@getinsight.it/getinsight-common';
import { authService } from '../../services/auth';

const httpClient: HttpClient = new HttpClient(window.env.API_URL);

const updateHttpClient = async (isAuthenticated: boolean): Promise<void> => {
  if (isAuthenticated) {
    const token: string = await authService.getBearerToken() as string;

    console.log('####### http.js -. TOKEN');
    console.log(token);

    if (token) {
      httpClient.addBearerAuthorization(token);
    }

    console.log(httpClient);
  }
};

export { httpClient, updateHttpClient };
