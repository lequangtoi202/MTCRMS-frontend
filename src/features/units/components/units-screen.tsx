"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { ApiError } from "@/shared/lib/api/api-error";
import { cn } from "@/shared/lib/utils/cn";

import { useCreateUnit, useUnitDetail, useUnitTree, useUpdateUnit } from "../hooks/use-units";
import {
  UNIT_LEVEL_LABELS,
  buildUnitPath,
  findFirstNode,
  findUnitInTree,
  flattenUnitTree,
  getInitialExpandedIds,
  getUnitFormDefaults,
} from "../lib/unit-tree";
import type { UnitMutationPayload, UnitTreeNode } from "../types/unit";

type NavigationItem = {
  label: string;
  icon: string;
  href?: string;
  active?: boolean;
};

const navigationItems: NavigationItem[] = [
  { label: "Bảng điều khiển", icon: "dashboard", href: ROUTES.dashboard },
  { label: "Cơ cấu tổ chức", icon: "account_tree", href: ROUTES.units, active: true },
  { label: "Quản lý quân nhân", icon: "groups" },
  { label: "Chương trình huấn luyện", icon: "menu_book" },
  { label: "Lịch huấn luyện", icon: "calendar_month" },
  { label: "Điểm danh & Thực hiện", icon: "how_to_reg" },
  { label: "Kiểm tra & Đánh giá", icon: "grading" },
  { label: "Theo dõi SSCĐ", icon: "military_tech" },
  { label: "Báo cáo", icon: "analytics" },
  { label: "Thông báo & Cảnh báo", icon: "notifications_active" },
  { label: "Audit log", icon: "history_edu" },
];

type FormMode = "create" | "edit";

function getMutationErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Không thể lưu thông tin đơn vị. Vui lòng thử lại.";
}

function TreeNodeItem({
  node,
  depth,
  expandedIds,
  selectedUnitId,
  onSelect,
  onToggle,
}: {
  node: UnitTreeNode;
  depth: number;
  expandedIds: Set<string>;
  selectedUnitId: string | null;
  onSelect: (unitId: string) => void;
  onToggle: (unitId: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = node.id === selectedUnitId;

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors",
          isSelected ? "border-l-4 border-[#00488d] bg-[#00488d]/10 text-[#00488d]" : "text-[#424752] hover:bg-[#eef2f8]",
        )}
        style={{ marginLeft: depth * 18 }}
      >
        <span
          className="material-symbols-outlined text-[18px]"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) {
              onToggle(node.id);
            }
          }}
        >
          {hasChildren ? (isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right") : "circle"}
        </span>
        <span className="font-medium">{node.name}</span>
      </button>

      {hasChildren && isExpanded ? (
        <div className="space-y-1">
          {node.children.map((childNode) => (
            <TreeNodeItem
              key={childNode.id}
              node={childNode}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedUnitId={selectedUnitId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function UnitForm({
  tree,
  selectedUnitId,
  initialValues,
  submitLabel,
  isPending,
  onCancel,
  onSubmit,
}: {
  tree: UnitTreeNode[];
  selectedUnitId: string | null;
  initialValues: UnitMutationPayload;
  submitLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (payload: UnitMutationPayload) => Promise<void>;
}) {
  const [formState, setFormState] = useState<UnitMutationPayload>(initialValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const flatUnits = useMemo(() => flattenUnitTree(tree), [tree]);
  const parentOptions = flatUnits.filter((unit) => unit.id !== selectedUnitId && unit.level === formState.level - 1);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await onSubmit({
        ...formState,
        code: formState.code.trim().toUpperCase(),
        name: formState.name.trim(),
        description: formState.description?.trim() || "",
      });
    } catch (error) {
      setErrorMessage(getMutationErrorMessage(error));
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Mã đơn vị</span>
          <input
            required
            value={formState.code}
            onChange={(event) => setFormState((current) => ({ ...current, code: event.target.value }))}
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Tên đơn vị</span>
          <input
            required
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Cấp đơn vị</span>
          <select
            value={formState.level}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                level: Number(event.target.value),
                parentId: Number(event.target.value) === 1 ? null : current.parentId,
              }))
            }
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          >
            {Object.entries(UNIT_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Đơn vị cấp trên</span>
          <select
            value={formState.parentId ?? ""}
            disabled={formState.level === 1}
            onChange={(event) => setFormState((current) => ({ ...current, parentId: event.target.value || null }))}
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10 disabled:opacity-60"
          >
            <option value="">Chọn đơn vị cấp trên</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Quân số</span>
          <input
            type="number"
            min={0}
            value={formState.headcount ?? 0}
            onChange={(event) => setFormState((current) => ({ ...current, headcount: Number(event.target.value) }))}
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Thứ tự hiển thị</span>
          <input
            type="number"
            value={formState.sortOrder ?? 0}
            onChange={(event) => setFormState((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
            className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Ghi chú</span>
        <textarea
          rows={4}
          value={formState.description ?? ""}
          onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
          className="w-full rounded-xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
        />
      </label>

      <label className="flex items-center gap-3 rounded-xl bg-[#f1f4fa] px-4 py-3 text-sm font-medium text-[#424752]">
        <input
          type="checkbox"
          checked={formState.isActive ?? true}
          onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
        />
        Đơn vị đang hoạt động
      </label>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#f1b7bc] bg-[#fff3f2] px-4 py-3 text-sm text-[#8f1d1d]">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="ghost" className="rounded-xl" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" className="rounded-xl bg-[#00488d] hover:bg-[#005fb8]" disabled={isPending}>
          {isPending ? "Đang lưu..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function UnitsScreen() {
  const treeQuery = useUnitTree();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();

  const tree = useMemo(() => treeQuery.data ?? [], [treeQuery.data]);
  const effectiveSelectedUnitId = selectedUnitId ?? findFirstNode(tree)?.id ?? null;
  const effectiveExpandedIds = useMemo(
    () => (expandedIds.size > 0 ? expandedIds : getInitialExpandedIds(tree)),
    [expandedIds, tree],
  );

  const detailQuery = useUnitDetail(effectiveSelectedUnitId);
  const selectedNode = effectiveSelectedUnitId ? findUnitInTree(tree, effectiveSelectedUnitId) : null;
  const breadcrumb = effectiveSelectedUnitId ? buildUnitPath(tree, effectiveSelectedUnitId) : [];

  async function handleCreate(payload: UnitMutationPayload) {
    const createdUnit = await createMutation.mutateAsync(payload);
    setSelectedUnitId(createdUnit.id);
    setFormMode(null);
  }

  async function handleUpdate(payload: UnitMutationPayload) {
    if (!effectiveSelectedUnitId) {
      return;
    }

    await updateMutation.mutateAsync({ id: effectiveSelectedUnitId, payload });
    setFormMode(null);
  }

  function handleAddChild() {
    setFormMode("create");
  }

  function toggleExpanded(unitId: string) {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }

      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20]">
      <aside className="fixed top-0 left-0 z-40 hidden h-full w-72 flex-col overflow-y-auto bg-slate-100 md:flex">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00488d] text-white">
              <span className="material-symbols-outlined">military_tech</span>
            </div>
            <div>
              <div className="font-heading text-xl font-bold tracking-tight text-blue-900">MTCRMS</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Command Center</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href ?? "#"}
              className={cn(
                "mx-2 flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
                item.active
                  ? "rounded-full bg-blue-200 font-semibold text-blue-900"
                  : "text-slate-600 hover:bg-slate-200 hover:text-blue-800",
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen md:ml-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 px-6 shadow-[0_20px_40px_rgba(24,28,32,0.06)] backdrop-blur-xl md:px-8">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[#727783]">search</span>
            <input
              placeholder="Tìm kiếm đơn vị..."
              className="w-full rounded-full bg-[#f1f4fa] py-2 pr-4 pl-10 text-sm outline-none focus:ring-4 focus:ring-[#00488d]/10"
            />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-xs font-bold text-[#424752]">CHƯƠNG TRÌNH ĐIỀU HÀNH</span>
          </div>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight">Cơ cấu tổ chức</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#727783]">
                {breadcrumb.length > 0
                  ? breadcrumb.map((node, index) => (
                      <div key={node.id} className="flex items-center gap-2">
                        <span className={cn(index === breadcrumb.length - 1 && "font-semibold text-[#00488d]")}>
                          {node.name}
                        </span>
                        {index < breadcrumb.length - 1 ? (
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        ) : null}
                      </div>
                    ))
                  : "Đang tải sơ đồ đơn vị"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="rounded-xl">
                Xuất sơ đồ (PDF)
              </Button>
              <Button className="rounded-xl bg-[#00488d] hover:bg-[#005fb8]" onClick={handleAddChild}>
                Thêm đơn vị mới
              </Button>
            </div>
          </div>

          {treeQuery.isLoading ? (
            <div className="rounded-3xl border border-[#d6dce8] bg-white p-8 text-sm text-[#486176]">Đang tải cây đơn vị...</div>
          ) : treeQuery.isError ? (
            <div className="rounded-3xl border border-[#f1b7bc] bg-[#fff3f2] p-8 text-sm text-[#8f1d1d]">
              Không thể tải cây đơn vị. Kiểm tra backend local và token đăng nhập.
            </div>
          ) : tree.length === 0 ? (
            <div className="rounded-3xl border border-[#d6dce8] bg-white p-8 text-sm text-[#486176]">
              Chưa có đơn vị nào trong hệ thống. Hãy tạo đơn vị cấp 1 đầu tiên.
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-6">
                <section className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#727783]">Sơ đồ phân cấp</h2>
                    <span className="material-symbols-outlined text-[#727783]">filter_list</span>
                  </div>

                  <div className="space-y-1">
                    {tree.map((node) => (
                      <TreeNodeItem
                        key={node.id}
                        node={node}
                        depth={0}
                        expandedIds={effectiveExpandedIds}
                        selectedUnitId={effectiveSelectedUnitId}
                        onSelect={setSelectedUnitId}
                        onToggle={toggleExpanded}
                      />
                    ))}
                  </div>
                </section>

                {selectedNode ? (
                  <section className="rounded-3xl bg-[#00488d] p-6 text-white shadow-[0_24px_50px_rgba(0,72,141,0.22)]">
                    <div className="mb-6 flex items-start justify-between">
                      <span className="material-symbols-outlined text-[#a8c8ff]">groups_3</span>
                      <span className="rounded-full bg-[#005fb8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                        {selectedNode.isActive ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </div>

                    <p className="text-sm text-white/70">Tổng quân số toàn nhánh</p>
                    <p className="mt-2 text-4xl font-extrabold tracking-tight">{selectedNode.totalHeadcount}</p>
                    <p className="mt-4 text-xs text-[#cadcff]">
                      {selectedNode.directChildrenCount} đơn vị trực thuộc, {selectedNode.descendantCount} đơn vị hậu duệ
                    </p>
                  </section>
                ) : null}
              </div>

              <div className="space-y-8">
                {formMode ? (
                  <section className="rounded-3xl bg-white p-8 shadow-sm">
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[#181c20]">
                        {formMode === "create" ? "Tạo đơn vị mới" : "Cập nhật đơn vị"}
                      </h2>
                      <p className="mt-2 text-sm text-[#727783]">Form thêm/sửa bám validation 6 cấp của backend M02.</p>
                    </div>

                    <UnitForm
                      tree={tree}
                      selectedUnitId={effectiveSelectedUnitId}
                      initialValues={
                        formMode === "edit"
                          ? getUnitFormDefaults(detailQuery.data ?? null)
                          : {
                              code: "",
                              name: "",
                              level: selectedNode ? (selectedNode.level < 6 ? selectedNode.level + 1 : selectedNode.level) : 1,
                              parentId: selectedNode ? (selectedNode.level < 6 ? selectedNode.id : selectedNode.parentId) : null,
                              headcount: 0,
                              sortOrder: 0,
                              description: "",
                              isActive: true,
                            }
                      }
                      submitLabel={formMode === "create" ? "Tạo đơn vị" : "Lưu thay đổi"}
                      isPending={createMutation.isPending || updateMutation.isPending}
                      onCancel={() => setFormMode(null)}
                      onSubmit={formMode === "create" ? handleCreate : handleUpdate}
                    />
                  </section>
                ) : detailQuery.isLoading ? (
                  <section className="rounded-3xl bg-white p-8 shadow-sm">Đang tải chi tiết đơn vị...</section>
                ) : detailQuery.isError || !detailQuery.data ? (
                  <section className="rounded-3xl border border-[#f1b7bc] bg-[#fff3f2] p-8 text-sm text-[#8f1d1d]">
                    Không thể tải chi tiết đơn vị.
                  </section>
                ) : (
                  <>
                    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
                      <div className="h-32 bg-gradient-to-r from-blue-900 to-[#005fb8]" />
                      <div className="-mt-12 px-8 pb-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                          <div className="flex items-end gap-5">
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-xl">
                              <span className="material-symbols-outlined text-4xl text-[#00488d]">stars</span>
                            </div>
                            <div>
                              <h2 className="font-heading text-2xl font-extrabold">{detailQuery.data.name}</h2>
                              <p className="mt-1 text-sm font-medium text-[#727783]">Mã đơn vị: {detailQuery.data.code}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="secondary" className="rounded-xl" onClick={() => setFormMode("edit")}>
                              Chỉnh sửa
                            </Button>
                            <Button className="rounded-xl bg-[#00488d] hover:bg-[#005fb8]" onClick={handleAddChild}>
                              Thêm đơn vị con
                            </Button>
                          </div>
                        </div>

                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Cấp đơn vị</p>
                            <p className="mt-2 text-sm font-semibold">{UNIT_LEVEL_LABELS[detailQuery.data.level]}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Quân số trực tiếp</p>
                            <p className="mt-2 text-sm font-semibold">{detailQuery.data.headcount} nhân sự</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Tổng quân số nhánh</p>
                            <p className="mt-2 text-sm font-semibold text-[#00488d]">{detailQuery.data.stats.totalHeadcount} nhân sự</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Đơn vị trực thuộc</p>
                            <p className="mt-2 text-sm font-semibold">{detailQuery.data.stats.directChildrenCount} đơn vị</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Hậu duệ</p>
                            <p className="mt-2 text-sm font-semibold">{detailQuery.data.stats.descendantCount} đơn vị</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727783]">Trạng thái</p>
                            <p className="mt-2 text-sm font-semibold">{detailQuery.data.isActive ? "Đang hoạt động" : "Tạm dừng"}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <article className="rounded-3xl bg-white p-8 shadow-sm">
                        <div className="mb-8">
                          <h3 className="font-heading text-xl font-extrabold">Mô tả đơn vị</h3>
                          <p className="mt-2 text-sm text-[#727783]">Chi tiết đơn vị và nhóm trực thuộc theo dữ liệu backend.</p>
                        </div>

                        <p className="text-sm leading-7 text-[#424752]">
                          {detailQuery.data.description || "Chưa có mô tả cho đơn vị này."}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                          {selectedNode?.children.map((child) => (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => setSelectedUnitId(child.id)}
                              className="rounded-2xl bg-[#f1f4fa] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
                            >
                              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#00488d]">{child.code}</p>
                              <p className="mt-2 text-base font-bold text-[#181c20]">{child.name}</p>
                              <p className="mt-4 text-xs text-[#727783]">Quân số: {child.headcount}</p>
                            </button>
                          ))}

                          {selectedNode && selectedNode.children.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-[#d0d8e5] p-5 text-sm text-[#727783]">
                              Chưa có đơn vị trực thuộc.
                            </div>
                          ) : null}
                        </div>
                      </article>

                      <article className="rounded-3xl border-l-4 border-[#930039] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading text-lg font-bold">Thống kê & Cảnh báo</h3>
                          <span className="material-symbols-outlined text-[#930039]">warning</span>
                        </div>

                        <div className="mt-6 space-y-5">
                          <div>
                            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#727783]">
                              <span>Quân số trực tiếp / toàn nhánh</span>
                              <span>
                                {detailQuery.data.headcount} / {detailQuery.data.stats.totalHeadcount}
                              </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-[#e9edf4]">
                              <div
                                className="h-full rounded-full bg-[#930039]"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round((detailQuery.data.headcount / Math.max(detailQuery.data.stats.totalHeadcount, 1)) * 100),
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="rounded-2xl bg-[#fff1f1] p-4 text-sm text-[#8f1d1d]">
                            {detailQuery.data.isActive
                              ? "Đơn vị đang hoạt động. Có thể tiếp tục cập nhật cơ cấu và quân số."
                              : "Đơn vị hiện đang tạm dừng hoạt động. Cần xác nhận trước khi gán quân số mới."}
                          </div>
                        </div>
                      </article>
                    </section>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
