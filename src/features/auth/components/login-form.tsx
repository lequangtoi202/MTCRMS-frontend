"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";

import { ROUTES } from "@/shared/constants/routes";
import { ApiError } from "@/shared/lib/api/api-error";

import { login } from "../api/login";
import { createSessionState, writeSession } from "../lib/auth-session";

import { AuthIcon } from "./auth-icon";

type FormState = {
  mssq: string;
  password: string;
};

const initialFormState: FormState = {
  mssq: "",
  password: "",
};

function buildErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 423) {
      return "Tài khoản đang bị khóa tạm thời. Liên hệ quản trị viên đơn vị để được hỗ trợ.";
    }

    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại sau.";
}

function FieldShell({
  children,
  icon,
}: Readonly<{
  children: ReactNode;
  icon: "badge" | "lock";
}>) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
        <AuthIcon name={icon} className="h-5 w-5" />
      </div>
      {children}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirectTo") || ROUTES.dashboard;
  const isSubmitDisabled = isSubmitting || !formState.mssq.trim() || !formState.password.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        mssq: formState.mssq.trim(),
        password: formState.password,
      });

      writeSession(createSessionState(response));

      router.replace(
        response.user.mustChangePassword ? `${ROUTES.dashboard}?notice=password-reset-required` : redirectTo,
      );
    } catch (error) {
      setFormError(buildErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/85"
          htmlFor="mssq"
        >
          Mã số quân nhân (MSSQ)
        </label>
        <FieldShell icon="badge">
          <input
            id="mssq"
            name="mssq"
            type="text"
            autoComplete="username"
            placeholder="Ví dụ: 2024.123456"
            value={formState.mssq}
            onChange={(event) => setFormState((current) => ({ ...current, mssq: event.target.value }))}
            className="block h-14 w-full rounded-2xl border border-outline-variant/60 bg-surface-container-low py-3 pr-4 pl-12 text-[15px] text-on-surface outline-none transition-all placeholder:text-outline/55 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </FieldShell>
      </div>

      <div className="space-y-2">
        <label
          className="ml-1 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant/85"
          htmlFor="password"
        >
          Mật khẩu
        </label>
        <FieldShell icon="lock">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={formState.password}
            onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
            className="block h-14 w-full rounded-2xl border border-outline-variant/60 bg-surface-container-low py-3 pr-4 pl-12 text-[15px] text-on-surface outline-none transition-all placeholder:text-outline/55 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </FieldShell>
      </div>

      {formError ? (
        <div className="rounded-2xl border border-error-container bg-[rgb(255,243,242)] px-4 py-3 text-sm leading-6 text-on-error-container">
          {formError}
        </div>
      ) : null}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-extrabold tracking-[0.03em] text-white shadow-[0_18px_34px_rgba(0,72,141,0.24)] transition-all hover:bg-[#11579b] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{isSubmitting ? "ĐANG XÁC THỰC" : "TRUY CẬP HỆ THỐNG"}</span>
          <AuthIcon name="login" className="h-[18px] w-[18px]" />
        </button>
      </div>
    </form>
  );
}
