import { apiRequest } from './client';
import type { RefInfoResponse } from './types';

export async function getRefInfo(): Promise<RefInfoResponse> {
  return apiRequest<RefInfoResponse>('/api/v1/ref_info');
}
