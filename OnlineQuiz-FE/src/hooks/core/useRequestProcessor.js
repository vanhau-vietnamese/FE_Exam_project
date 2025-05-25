import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useQueryEnhancer = (options) => {
  const props = useQuery(options);
  return { ...props, isLoading: props.isRefetching || props.isFetching };
};

export const useMutationEnhancer = (options) => {
  const queryClient = useQueryClient();
  const { mutate, mutateAsync, ...rest } = useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueryKeys) {
        options.invalidateQueryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key], type: 'active' });
        });
      }
      options.onSuccess?.(data, variables, context);
    },
  });

  const mutateEnhancer = useCallback(
    (variables, mutateOption) => {
      return mutate(variables, mutateOption);
    },
    [mutate]
  );

  const mutateAsyncEnhancer = useCallback(
    (v, o) => {
      return mutateAsync(v, o);
    },
    [mutateAsync]
  );

  return {
    mutate: mutateEnhancer,
    mutateAsync: mutateAsyncEnhancer,
    ...rest,
  };
};
