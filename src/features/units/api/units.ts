import { httpClient } from "@/services/http/client";

import type { UnitDetail, UnitMutationPayload, UnitTreeNode } from "../types/unit";

export function getUnitTree() {
  return httpClient<UnitTreeNode[]>("/units/tree");
}

export function getUnitDetail(id: string) {
  return httpClient<UnitDetail>(`/units/${id}`);
}

export function createUnit(payload: UnitMutationPayload) {
  return httpClient<UnitDetail>("/units", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUnit(id: string, payload: UnitMutationPayload) {
  return httpClient<UnitDetail>(`/units/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
