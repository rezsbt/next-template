export type User = {
  id: string;
  name: string;
  email: string;
};

export type PaginatedUsers = {
  items: User[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
