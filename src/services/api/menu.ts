import { apiRequestValidated } from './client';
import { MainMenuResponseSchema } from './schemas';
import type { MainMenuResponse } from './types';

export async function getMainMenu(): Promise<MainMenuResponse> {
  return apiRequestValidated(MainMenuResponseSchema, '/api/v1/info_mainmenu');
}
