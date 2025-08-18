import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseDebouncedSearchReturn<T> {
  immediateValue: T;
  debouncedValue: T;
  updateSearchTerm: (newValue: T) => void;
  isSearching: boolean;
}

export function useDebouncedSearch<T>(
  initialValue: T,
  delay: number,
): UseDebouncedSearchReturn<T> {
  const initialValueRef = useRef(initialValue);

  const [immediateValue, setImmediateValue] = useState<T>(
    initialValueRef.current,
  );
  const [debouncedValue, setDebouncedValue] = useState<T>(
    initialValueRef.current,
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [immediateValue, delay]);

  const updateSearchTerm = useCallback((newValue: T) => {
    setImmediateValue(newValue);
  }, []);

  const isSearching = immediateValue !== debouncedValue;

  return { immediateValue, debouncedValue, updateSearchTerm, isSearching };
}
