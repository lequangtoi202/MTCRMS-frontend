import type { UnitDetail, UnitMutationPayload, UnitTreeNode } from "../types/unit";

export const UNIT_LEVEL_LABELS: Record<number, string> = {
  1: "Quân khu",
  2: "Lữ đoàn",
  3: "Tiểu đoàn",
  4: "Đại đội",
  5: "Trung đội",
  6: "Tiểu đội",
};

export function flattenUnitTree(nodes: UnitTreeNode[], depth = 0): Array<UnitTreeNode & { depth: number }> {
  return nodes.flatMap((node) => [{ ...node, depth }, ...flattenUnitTree(node.children, depth + 1)]);
}

export function getInitialExpandedIds(nodes: UnitTreeNode[]) {
  const expandedIds = new Set<string>();

  function walk(nodeList: UnitTreeNode[]) {
    nodeList.forEach((node) => {
      if (node.children.length > 0 && node.level <= 3) {
        expandedIds.add(node.id);
      }

      walk(node.children);
    });
  }

  walk(nodes);
  return expandedIds;
}

export function findFirstNode(nodes: UnitTreeNode[]): UnitTreeNode | null {
  return nodes[0] ?? null;
}

export function findUnitInTree(nodes: UnitTreeNode[], unitId: string): UnitTreeNode | null {
  for (const node of nodes) {
    if (node.id === unitId) {
      return node;
    }

    const match = findUnitInTree(node.children, unitId);

    if (match) {
      return match;
    }
  }

  return null;
}

export function buildUnitPath(nodes: UnitTreeNode[], unitId: string): UnitTreeNode[] {
  const path: UnitTreeNode[] = [];

  function dfs(nodeList: UnitTreeNode[]): boolean {
    for (const node of nodeList) {
      path.push(node);

      if (node.id === unitId) {
        return true;
      }

      if (dfs(node.children)) {
        return true;
      }

      path.pop();
    }

    return false;
  }

  return dfs(nodes) ? [...path] : [];
}

export function getUnitFormDefaults(detail: UnitDetail | null): UnitMutationPayload {
  if (!detail) {
    return {
      code: "",
      name: "",
      level: 1,
      parentId: null,
      headcount: 0,
      sortOrder: 0,
      description: "",
      isActive: true,
    };
  }

  return {
    code: detail.code,
    name: detail.name,
    level: detail.level,
    parentId: detail.parentId,
    headcount: detail.headcount,
    sortOrder: detail.sortOrder,
    description: detail.description ?? "",
    isActive: detail.isActive,
  };
}
