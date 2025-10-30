import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Generic Firestore hook for real-time data
export function useFirestoreData<T>(
  queryKey: string[],
  serviceFunction: () => Promise<T[]>,
  subscribeFunction?: (callback: (data: T[]) => void) => () => void
) {
  const queryClient = useQueryClient();

  // Use React Query for data fetching
  const query = useQuery({
    queryKey,
    queryFn: serviceFunction,
  });

  // Set up real-time subscription if provided
  useEffect(() => {
    if (!subscribeFunction) return;

    const unsubscribe = subscribeFunction((data) => {
      queryClient.setQueryData(queryKey, data);
    });

    return unsubscribe;
  }, [queryKey, subscribeFunction, queryClient]);

  return query;
}

// Generic mutation hook for Firestore operations
export function useFirestoreMutation<T, U>(
  mutationFn: (data: U) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// Hook for managing form submissions with optimistic updates
export function useOptimisticMutation<T, U>(
  mutationFn: (data: U) => Promise<T>,
  queryKey: string[],
  updateFn: (oldData: T[] | undefined, newData: U) => T[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically update
      queryClient.setQueryData<T[]>(queryKey, (old) => updateFn(old, newData));

      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
