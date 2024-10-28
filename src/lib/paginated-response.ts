export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
