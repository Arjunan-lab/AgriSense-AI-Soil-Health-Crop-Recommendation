/**
 * hooks/useApi.js
 * ---------------
 * Generic data-fetching hook wrapping an axios call.
 * Returns { data, loading, error, execute } — the execute() method
 * is called explicitly so hooks can be used for both GET and POST endpoints.
 */
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useApi = (apiFunction) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred.';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
