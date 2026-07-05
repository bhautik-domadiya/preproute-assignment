import { api } from "./axios";
import type { CreateTestPayload, TestsResponse, TestDetail } from "@/types/test";

export async function getTests() {
  const { data } = await api.get<TestsResponse>("/tests");
  return data.data;
}

export async function getTest(id: string) {
  const { data } = await api.get<{ success: boolean; data: TestDetail }>(`/tests/${id}`);
  return data.data;
}

export async function createTest(payload: CreateTestPayload) {
  const { data } = await api.post<{ success: boolean; data: TestDetail }>("/tests", payload);
  return data.data;
}

export async function updateTest(id: string, payload: Partial<CreateTestPayload>) {
  const { data } = await api.put<{ success: boolean; data: TestDetail }>(`/tests/${id}`, payload);
  return data.data;
}

export async function deleteTest(id: string) {
  const { data } = await api.delete<{ success: boolean; data: null }>(`/tests/${id}`);
  return data.data;
}