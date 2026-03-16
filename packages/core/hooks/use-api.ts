"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query"
import { api, ApiError } from "../lib/api"

/**
 * Generic GET hook with TanStack Query
 */
export function useApiQuery<T>(
  path: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<T, ApiError>, "queryKey" | "queryFn">
) {
  return useQuery<T, ApiError>({
    queryKey: [path, params],
    queryFn: () => api.get<T>(path, params),
    ...options,
  })
}

/**
 * Generic mutation hook with TanStack Query
 */
export function useApiMutation<TData = any, TVariables = any>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  pathOrFn: string | ((variables: TVariables) => string),
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn">
) {
  const queryClient = useQueryClient()

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const path = typeof pathOrFn === "function" ? pathOrFn(variables) : pathOrFn
      
      switch (method) {
        case "POST":
          return api.post<TData>(path, variables)
        case "PUT":
          return api.put<TData>(path, variables)
        case "PATCH":
          return api.patch<TData>(path, variables)
        case "DELETE":
          return api.delete<TData>(path)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    onSuccess: (data, variables, context) => {
      // Call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Invalidate queries by path pattern
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return (pathPattern: string) => {
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        const key = query.queryKey[0]
        return typeof key === "string" && key.startsWith(pathPattern)
      }
    })
  }
}
