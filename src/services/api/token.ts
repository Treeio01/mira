const ACCESS_TOKEN_KEY = 'mira_access_token';
const EXPIRES_AT_KEY = 'mira_token_expires_at';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setToken(accessToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  isExpired(): boolean {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (!expiresAt) return true;
    // Считаем истёкшим за 30с до реального срока
    return Date.now() >= Number(expiresAt) - 30_000;
  },

  hasToken(): boolean {
    return !!this.getAccessToken();
  },
};
