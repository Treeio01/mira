const required = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
};

export const env = {
  API_BASE_URL: required('VITE_API_BASE_URL'),
} as const;
