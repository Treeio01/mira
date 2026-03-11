import { apiRequest } from './client';
import type { MainMenuResponse } from './types';

export async function getMainMenu(): Promise<MainMenuResponse> {
  return apiRequest<MainMenuResponse>('/api/v1/info_mainmenu');
}
