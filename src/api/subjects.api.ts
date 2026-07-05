import { api } from "./axios";
import type { Subject } from "@/types/master";

export async function getSubjects() {
  const { data } = await api.get("/subjects");

  return data.data as Subject[];
}