// src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
    code: 'ok' | 'ko';
    data: T;
    message: string;
  }
  