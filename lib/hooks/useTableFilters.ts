"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useTableFilters<T extends Record<string, string>>(defaults: T) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const val = searchParams.get(key);
      if (val) result[key as keyof T] = val as T[keyof T];
    }
    return result;
  }, [searchParams, defaults]);

  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key as string, value);
      else params.delete(key as string);
      if (key !== "page") params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(defaults).some((key) => {
      const val = searchParams.get(key);
      return val && val !== defaults[key as keyof T];
    });
  }, [searchParams, defaults]);

  return { filters, setFilter, resetFilters, hasActiveFilters };
}
