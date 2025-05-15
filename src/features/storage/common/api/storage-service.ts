import { authService } from "../../../auth/common/AuthService.ts";
import axios from "axios";

export const STORAGE_API = {
  PAGINATED: "/v1/storages/paginated",
  DOWNLOAD: "/v1/storages/download"
};

export const downloadFile = async (id: number) => {
  const token = await authService.getBearerToken();
  const apiClient = axios.create({
    baseURL: window.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    }
  });

  return await apiClient.get(`${STORAGE_API.DOWNLOAD}/${id}`, {
    responseType: "blob",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
