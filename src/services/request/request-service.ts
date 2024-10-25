import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { REQUEST_API } from './request-api.ts';
import { RequestDTO } from "./request-dto.ts";

export class RequestService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {  // Removi o `private` aqui
    this.httpClient = httpClient;
  }

  async getRequests(): Promise<RequestDTO | null> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(REQUEST_API.REQUESTS);

    if (response instanceof HttpRequestResponse) {
      return JSON.parse(response.data);
    } else {
      console.error('erro ao buscar solicitações');
    }

    return null;
  }

  // Ajustei o método para aceitar FormData
  async createRequest(formData: FormData, headers?: Map<string, string>): Promise<HttpRequestResponse | HttpRequestError> {
    try {
      console.log("enviando requisição para:", REQUEST_API.REQUESTS);

      fetch(window.env.API_URL + REQUEST_API.REQUESTS, {
        method: "post",
        body: formData,
        headers: {
          "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3aEFiUS16ek5xc050d2pzcjJEOVRmR2J6YWhieHRreXFnWkhXVmg4WTM4In0.eyJleHAiOjE3Mjk4ODQxMzUsImlhdCI6MTcyOTg4MzgzNSwiYXV0aF90aW1lIjoxNzI5ODY0Njk5LCJqdGkiOiJkNTg5MTg4Ni04MGQzLTRlYjAtYjcyNS05ZTFlMTEyMzQ2YzIiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmNsb3VkLmdldGluc2lnaHQudGVjaC9yZWFsbXMvYWNjZXNzLXBpbG90IiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6IjE2ODMwYjdiLWM2YTQtNGZlYS04Mjc2LWFjMjJmYzZiZjU2NiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFjY2Vzc3BpbG90LWZyb250ZW5kIiwic2lkIjoiYzliYjkzMTItYjE4NC00NWQ3LTg0NDgtYjA2N2VkMzA2NGEyIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIiwiaHR0cDovL2xvY2FsaG9zdDo1MTczIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWFjY2Vzcy1waWxvdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwicmVhbG0tYWRtaW4iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IldhbmRlciBHb21lcyIsInByZWZlcnJlZF91c2VybmFtZSI6IndhbmRlci5nb21lc0BnZXRpbnNpZ2h0Lml0IiwiZ2l2ZW5fbmFtZSI6IldhbmRlciIsImZhbWlseV9uYW1lIjoiR29tZXMiLCJlbWFpbCI6IndhbmRlci5nb21lc0BnZXRpbnNpZ2h0Lml0In0.IzpWs_TmvoimVwddtPtwRmqMPMdan5MyWnmRUe6KXEtXnDrQVbUIqTyboArIsC4q7w1tF44DFaelTZ8X-8PNR7NHwad4FGf2kc1TZhYTV_kdntwQYgyMp65InUtguwQdokjJy4pQZuJd4pbtoeB7EyemvTo0znxuQ6MFCjD9fdMr44EA5TywiOf6NbHYKcmohxRTkwhGevyoaLovFAap1n4rmFpzbmSzLv7i9p2cIb66P0epER_mRixivOdMniIoZg4jicc6KGoZUq8Jxbxt4ZofZ7S_1HKEYVMhBaCR76172X8Mvm5MJ0BtJ2tuOdW5fUacbjRzyJwmzi1LbTf4Ag"
        }
      })

      // Remove o JSON.stringify e envia o FormData diretamente
      // const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(
      //   REQUEST_API.REQUESTS, 
      //   formData, // FormData sendo passado diretamente
      //   headers
      // );
      
      // if (response instanceof HttpRequestResponse) {
      //   return response;
      // } else {
      //   console.error('erro ao criar solicitação');
      //   return response;
      // }
    } catch (error) {
      console.error('erro ao enviar solicitação', error);
      throw error;
    }
  }
}


