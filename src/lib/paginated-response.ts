export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
