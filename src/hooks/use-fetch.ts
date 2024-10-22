import { useEffect, useRef, useState, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, any>();

export const useFetch = <T>(url: string, options?: RequestInit, enableCache: boolean = true): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const prevUrlRef = useRef<string>(url);

  // Memoize the fetchData function to avoid unnecessary recreation
  const fetchData = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { ...options, signal });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result);

      if (enableCache) {
        cache.set(url, result);
      }

    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong while fetching");
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, enableCache]);

  useEffect(() => {
    if (enableCache && cache.has(url) && prevUrlRef.current === url) {
      setData(cache.get(url));
      setLoading(false);
      return;
    }

    // Create an AbortController to handle request cancellation
    const controller = new AbortController();
    const { signal } = controller;

    fetchData(signal);

    prevUrlRef.current = url;

    // Cleanup function to cancel request if component unmounts or url changes
    return () => { controller.abort() };

  }, [url, options, enableCache, fetchData]);

  return { data, loading, error };
};
