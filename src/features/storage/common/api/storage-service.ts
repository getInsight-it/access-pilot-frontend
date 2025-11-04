import { authService } from "../../../auth/common/AuthService.ts";
import axios, { AxiosResponse } from "axios";

export const STORAGE_API = {
  PAGINATED: "/v1/storages/paginated",
  DOWNLOAD: "/v1/storages/download"
};

export const downloadFile = async (id: number): Promise<AxiosResponse<Blob>> => {
  const token = await authService.getBearerToken();

  const apiClient = axios.create({
    baseURL: window.env.API_URL,
    headers: {
      "Authorization": `${token}`
    }
  });

  return apiClient.get(`${STORAGE_API.DOWNLOAD}/${id}`, {
    responseType: "blob"
  });
};
