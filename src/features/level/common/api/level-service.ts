import { HttpClient, HttpRequestError, HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { httpClient } from "../../../../config/http/http.ts";
import { ColorUsage } from "../../../../common/types/color-usage.model.ts";
import { PAGINATION } from "../../../../common/constants/pagination.ts";
import { LevelSubItemResponseInterface } from "../types/level-subitem.model.ts";
import {
  LevelInterface,
  LevelResponseInterface,
  CreateLevelData,
  UpdateLevelData
} from "../types/level.model.ts";
import {
  LevelItemInterface,
  LevelItemsResponseInterface,
  CreateLevelItemData,
  UpdateLevelItemData
} from "../types/level-item.model.ts";
import { ItemHierarchyInterface } from "../types/item-hierarchy.model.ts";
import { LevelItemStatus } from "../types/level-status.enum.ts";
import { LevelExport, LevelImportRequest, LevelImportSummary } from "../types/level-export.model.ts";

const LEVEL_API = {
  LEVELS: "/v1/levels",
  LEVELS_COLORS: "/v1/levels/colors",
  LEVELS_EXPORT: "/v1/levels/export",
  LEVELS_IMPORT: "/v1/levels/import"
};

export class LevelService {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getLevels(
    pageIndex = PAGINATION.DEFAULT_PAGE_INDEX,
    pageSize = PAGINATION.LARGE_PAGE_SIZE,
    sortField = "id",
    sortType = "ASC"
  ): Promise<LevelResponseInterface> {
    const url = `${LEVEL_API.LEVELS}?pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortType=${sortType}`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelResponseInterface;
  }

  async getLevelHierarchy(id: number): Promise<ItemHierarchyInterface[]> {
    const url = `${LEVEL_API.LEVELS}/${id}/hierarchy`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ItemHierarchyInterface[];
  }

  async getItemSubItems(
    levelId: number,
    itemId: number,
    pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE,
    page: number = PAGINATION.DEFAULT_PAGE_INDEX,
    name: string = ""
  ): Promise<LevelSubItemResponseInterface> {
    let url = `${LEVEL_API.LEVELS}/${levelId}/items/${itemId}/subitems?pageSize=${pageSize}&pageIndex=${page}`;
    if (name && name.trim() !== "") {
      url += `&name=${encodeURIComponent(name)}`;
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelSubItemResponseInterface;
  }

  async getLevelById(id: string): Promise<LevelInterface> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(`${LEVEL_API.LEVELS}/${id}`);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelInterface;
  }

  async deleteLevel(id: string): Promise<void> {
    const url = `${LEVEL_API.LEVELS}/${id}`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.delete(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }
  }

  async getLevelItems(
    levelId: string,
    pageIndex: string | number = PAGINATION.DEFAULT_PAGE_INDEX,
    pageSize: string | number = PAGINATION.DEFAULT_PAGE_SIZE,
    sortField = "id",
    sortType = "ASC",
    name = ""
  ): Promise<LevelItemsResponseInterface> {
    let url = `${LEVEL_API.LEVELS}/${levelId}/items?pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortType=${sortType}`;
    if (name && name.trim() !== "") {
      url += `&name=${encodeURIComponent(name)}`;
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelItemsResponseInterface;
  }

  async getLevelItem(levelId: string, itemId: string): Promise<LevelItemInterface> {
    const url = `${LEVEL_API.LEVELS}/${levelId}/items/${itemId}`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelItemInterface;
  }

  async createLevelItem(levelId: string, itemData: CreateLevelItemData): Promise<LevelItemInterface> {
    const url = `${LEVEL_API.LEVELS}/${levelId}/items`;

    const formattedData: CreateLevelItemData = {
      name: itemData.name,
      description: itemData.description || "",
      externalCode: itemData.externalCode || ""
    };

    if (itemData.parentId) {
      formattedData.parentId = itemData.parentId;
    }

    const headers = new Map();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(url, formattedData, headers);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelItemInterface;
  }

  async updateLevelItem(levelId: string, itemId: string, itemData: CreateLevelItemData): Promise<void> {
    const updateData: UpdateLevelItemData = {
      id: Number(itemId),
      name: itemData.name,
      description: itemData.description || "",
      externalCode: itemData.externalCode || "",
      status: LevelItemStatus.ACTIVE
    };

    if (itemData.parentId !== undefined && itemData.parentId !== null) {
      updateData.parentId = Number(itemData.parentId);
    }

    const putUrl = `${LEVEL_API.LEVELS}/${levelId}/items/${itemId}`;
    const headers = new Map();
    headers.set("Content-Type", "application/json");

    const putResponse = await this.httpClient.put(putUrl, updateData, headers);

    if (putResponse instanceof HttpRequestError) {
      throw putResponse;
    }
  }

  async deleteLevelItem(levelId: string, itemId: string): Promise<void> {
    const url = `${LEVEL_API.LEVELS}/${levelId}/items/${itemId}`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.delete(url);

    if (response instanceof HttpRequestError) {
      throw response;
    }
  }

  async createLevel(levelData: CreateLevelData): Promise<LevelInterface | null> {
    const url = `${LEVEL_API.LEVELS}`;
    const data: CreateLevelData = {
      name: levelData.name,
      sigla: levelData.sigla,
      type: levelData.type || "BUSINESS",
      description: levelData.description || "",
      color: levelData.color || null
    };

    if (levelData.parentId) {
      data.parentId = levelData.parentId;
    }

    if (levelData.type === "EXTERNAL") {
      data.externalUrl = levelData.externalUrl || "";
      data.apiKey = levelData.apiKey || "";
    }

    if (levelData.uuid) {
      data.uuid = levelData.uuid;
    }

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(url, data);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    if (response.status === 204 || !response.data) {
      return null;
    }

    return response.data as LevelInterface;
  }

  async updateLevel(levelId: string, levelData: UpdateLevelData): Promise<LevelInterface | null> {
    const url = `${LEVEL_API.LEVELS}/${levelId}`;
    const data: UpdateLevelData = {
      id: Number.parseInt(levelId),
      name: levelData.name,
      sigla: levelData.sigla,
      type: levelData.type || "BUSINESS",
      description: levelData.description || "",
      color: levelData.color || null
    };

    if (levelData.parentId) {
      data.parentId = levelData.parentId;
    }

    if (levelData.type === "EXTERNAL") {
      data.externalUrl = levelData.externalUrl || "";

      if (levelData.apiKey && levelData.apiKey.trim() !== "") {
        data.apiKey = levelData.apiKey;
      }
    }

    if (levelData.uuid) {
      data.uuid = levelData.uuid;
    }

    const headers = new Map();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(url, data, headers);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    if (response.status === 204 || !response.data) {
      const verifyResponse = await this.httpClient.get(`${LEVEL_API.LEVELS}/${levelId}`);

      if (verifyResponse instanceof HttpRequestError) {
        throw verifyResponse;
      }

      return verifyResponse.data as LevelInterface;
    }

    return response.data as LevelInterface;
  }

  async getLevelColors(): Promise<ColorUsage[]> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(LEVEL_API.LEVELS_COLORS);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ColorUsage[];
  }

  async updateParent(levelId: string, parentId: string | null): Promise<LevelInterface | null> {
    const currentLevel = await this.getLevelById(levelId);
    if (!currentLevel) {
      throw new Error(`Level ${levelId} not found`);
    }

    const data: UpdateLevelData = {
      id: Number.parseInt(levelId),
      name: currentLevel.name,
      sigla: currentLevel.sigla || "",
      type: currentLevel.type,
      description: currentLevel.description || "",
      color: currentLevel.color || null
    };

    if (parentId && parentId !== "0") {
      data.parentId = Number(parentId);
    }

    if (currentLevel.uuid) {
      data.uuid = currentLevel.uuid;
    }

    if (currentLevel.type === "EXTERNAL") {
      data.externalUrl = currentLevel.externalUrl || "";
    }

    const url = `${LEVEL_API.LEVELS}/${levelId}`;
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.put(url, data);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    if (response.status === 204 || !response.data) {
      const verifyResponse = await this.httpClient.get(`${LEVEL_API.LEVELS}/${levelId}`);

      if (verifyResponse instanceof HttpRequestError) {
        throw verifyResponse;
      }

      return verifyResponse.data as LevelInterface;
    }

    return response.data as LevelInterface;
  }

  async getItemHierarchy(levelId: number, itemId: string): Promise<ItemHierarchyInterface[]> {
    const response = await this.httpClient.get(`${LEVEL_API.LEVELS}/${levelId}/items/${itemId}/hierarchy`);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as ItemHierarchyInterface[];
  }

  async exportLevels(includeItems: boolean = false, includeBuiltIn: boolean = true): Promise<LevelExport[]> {
    const queryParams = new URLSearchParams({
      includeItems: includeItems.toString(),
      includeBuiltIn: includeBuiltIn.toString()
    });
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.get(
      `${LEVEL_API.LEVELS_EXPORT}?${queryParams.toString()}`
    );

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelExport[];
  }

  async importLevels(request: LevelImportRequest): Promise<LevelImportSummary> {
    const response: HttpRequestResponse | HttpRequestError = await this.httpClient.post(LEVEL_API.LEVELS_IMPORT, request);

    if (response instanceof HttpRequestError) {
      throw response;
    }

    return response.data as LevelImportSummary;
  }
}

export const levelService: LevelService = new LevelService(httpClient);
