import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTest } from "@/api/tests.api";

export function useCreateTest() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createTest,
  
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["tests"],
        });
      },
    });
  }