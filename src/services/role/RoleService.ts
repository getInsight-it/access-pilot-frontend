import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { ROLE_API } from './role-api.ts';
import { httpClient } from '../../config/http/http.ts';

export class RoleService {

  httpCLient: HttpClient;

  private constructor(httpCLient: HttpClient) {
    this.httpCLient = httpCLient;
  }

  async getRoles(): any {
    console.log(httpClient);
    const response: HttpRequestResponse | HttpRequestError = await this.httpCLient.get(ROLE_API.ROLES);

    if (response instanceof HttpRequestResponse) {
      return response.data;
    } else {
      console.error('Deu ruim!');
    }

    return null;
  }

}
