export type UnitTreeNode = {
  id: string;
  code: string;
  name: string;
  level: number;
  parentId: string | null;
  headcount: number;
  totalHeadcount: number;
  sortOrder: number;
  description: string | null;
  isActive: boolean;
  directChildrenCount: number;
  descendantCount: number;
  children: UnitTreeNode[];
};

export type UnitStats = {
  totalHeadcount: number;
  directChildrenCount: number;
  descendantCount: number;
};

export type UnitDetail = {
  id: string;
  code: string;
  name: string;
  level: number;
  parentId: string | null;
  headcount: number;
  sortOrder: number;
  isActive: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  stats: UnitStats;
};

export type UnitMutationPayload = {
  code: string;
  name: string;
  level: number;
  parentId?: string | null;
  headcount?: number;
  sortOrder?: number;
  description?: string;
  isActive?: boolean;
};
