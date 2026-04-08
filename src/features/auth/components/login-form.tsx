"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { ApiError } from "@/shared/lib/api/api-error";

import { createSessionState, writeSession } from "../lib/auth-session";
import { useLogin } from "../hooks/use-login";

type FormState = {
  mssq: string;
  password: string;
};

const initialFormState: FormState = {
  mssq: "",
  password: "",
};

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function buildErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 423) {
      return "Tài khoản đang bị khóa tạm thời. Liên hệ quản trị viên đơn vị để được hỗ trợ.";
    }

    return error.message;
  }

  return "Không thể kết nối tới hệ thống xác thực. Vui lòng thử lại sau.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const [formState, setFormState] = useState(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirectTo") || ROUTES.dashboard;

  const isSubmitDisabled = loginMutation.isPending || !formState.mssq.trim() || !formState.password.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    try {
      const response = await loginMutation.mutateAsync({
        mssq: formState.mssq.trim(),
        password: formState.password,
      });

      writeSession(createSessionState(response));

      const nextRoute = response.mustChangePassword
        ? `${ROUTES.dashboard}?notice=password-reset-required`
        : redirectTo;

      router.replace(nextRoute);
    } catch (error) {
      setFormError(buildErrorMessage(error));
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Field>
        <label className="ml-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#424752]/80" htmlFor="mssq">
          Mã số quân nhân (MSSQ)
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#727783]">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <input
            id="mssq"
            name="mssq"
            type="text"
            autoComplete="username"
            placeholder="Ví dụ: 2024.123456"
            value={formState.mssq}
            onChange={(event) => setFormState((current) => ({ ...current, mssq: event.target.value }))}
            className="block w-full rounded-lg border border-[#c2c6d4]/50 bg-[#f1f4fa] py-3.5 pr-4 pl-11 text-sm text-[#181c20] outline-none transition-all placeholder:text-[#727783]/40 focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </div>
      </Field>

      <Field>
        <label
          className="ml-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#424752]/80"
          htmlFor="password"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#727783]">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={formState.password}
            onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
            className="block w-full rounded-lg border border-[#c2c6d4]/50 bg-[#f1f4fa] py-3.5 pr-4 pl-11 text-sm text-[#181c20] outline-none transition-all placeholder:text-[#727783]/40 focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </div>
      </Field>

      {formError ? (
        <div className="rounded-2xl border border-[#f1b7bc] bg-[#fff3f2] px-4 py-3 text-sm leading-6 text-[#8f1d1d]">
          {formError}
        </div>
      ) : null}

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitDisabled}
          className="h-14 w-full justify-center gap-2 rounded-lg bg-[#00488d] text-sm font-bold tracking-[0.06em] shadow-lg hover:bg-[#005fb8]"
        >
          {loginMutation.isPending ? "ĐANG XÁC THỰC..." : "TRUY CẬP HỆ THỐNG"}
          <span className="material-symbols-outlined text-sm">login</span>
        </Button>
      </div>
    </form>
  );
}
