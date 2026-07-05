import { getSubjects } from "@/api/subjects.api";
import { useQuery } from "@tanstack/react-query";

export function useSubjects() {
    return useQuery({
      queryKey: ["subjects"],
      queryFn: getSubjects,
    });
  }