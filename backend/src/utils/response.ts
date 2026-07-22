export interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: any;
  pagination?: PaginationData;
}

export const formatResponse = <T>(
  success: boolean,
  message: string,
  data: T | null = null,
  errors: any = null,
  pagination?: PaginationData
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
  };

  if (errors) {
    response.errors = errors;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
};
