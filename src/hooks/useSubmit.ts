import { useState, useCallback, useRef } from 'react';
import { extractErrorMessage } from '../lib/error';

export function useSubmit<T>(
  submitFn: () => Promise<T>,
  fallbackError = 'Произошла ошибка',
) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fnRef = useRef(submitFn);
  fnRef.current = submitFn;

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await fnRef.current();
      return result;
    } catch (e) {
      setError(extractErrorMessage(e, fallbackError));
      return undefined;
    } finally {
      setSubmitting(false);
    }
  }, [fallbackError]);

  const clearError = useCallback(() => setError(null), []);

  return { submit, submitting, error, clearError };
}
