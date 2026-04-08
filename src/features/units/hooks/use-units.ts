"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createUnit, getUnitDetail, getUnitTree, updateUnit } from "../api/units";
import type { UnitMutationPayload } from "../types/unit";

const unitsQueryKey = ["units", "tree"] as const;

export function useUnitTree() {
  return useQuery({
    queryKey: unitsQueryKey,
    queryFn: getUnitTree,
  });
}

export function useUnitDetail(unitId: string | null) {
  return useQuery({
    queryKey: ["units", "detail", unitId],
    queryFn: () => getUnitDetail(unitId as string),
    enabled: Boolean(unitId),
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UnitMutationPayload) => createUnit(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: unitsQueryKey });
    },
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UnitMutationPayload }) =>
      updateUnit(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: unitsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["units", "detail", variables.id] });
    },
  });
}
