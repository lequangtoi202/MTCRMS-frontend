"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { ApiError } from "@/shared/lib/api/api-error";

import { changePassword } from "../api/change-password";
import { logout } from "../api/logout";
import { clearSession, markPasswordChanged, readSession, writeSession } from "../lib/auth-session";
import { useSessionGuard } from "../hooks/use-session-guard";

function NoticeBanner() {
  const searchParams = useSearchParams();
  const notice = searchParams.get("notice");

  if (notice !== "password-reset-required") {
    return null;
  }

  return (
    <div className="rounded-3xl border border-[#c9d6ea] bg-[#f4f8ff] px-5 py-4 text-sm text-[#324657]">
      <p className="font-semibold">Đổi mật khẩu được yêu cầu</p>
      <p className="mt-1 leading-6">
        Tài khoản của bạn đang ở trạng thái bắt buộc đổi mật khẩu. Hoàn tất cập nhật ngay bên dưới để tiếp tục sử dụng hệ
        thống an toàn.
      </p>
    </div>
  );
}

function buildMutationError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallbackMessage;
}

function PasswordChangeCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      const currentSession = readSession();

      if (currentSession) {
        writeSession(markPasswordChanged(currentSession));
      }

      setCurrentPassword("");
      setNewPassword("");
      setFeedback({
        tone: "success",
        message: "Mật khẩu đã được cập nhật thành công. Trạng thái bắt buộc đổi mật khẩu đã được gỡ bỏ.",
      });
    },
    onError: (error) => {
      setFeedback({
        tone: "error",
        message: buildMutationError(error, "Không thể đổi mật khẩu lúc này. Vui lòng thử lại."),
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  }

  const isDisabled = changePasswordMutation.isPending || !currentPassword.trim() || !newPassword.trim();

  return (
    <section className="rounded-3xl border border-[#c9d6ea] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Bảo mật tài khoản</p>
        <h2 className="mt-3 font-heading text-2xl font-extrabold text-[#181c20]">Đổi mật khẩu lần đầu</h2>
        <p className="mt-2 text-sm leading-6 text-[#486176]">
          Backend đã sẵn sàng endpoint đổi mật khẩu. Bạn cần cập nhật mật khẩu để hoàn tất quy trình xác thực Phase 1.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Mật khẩu hiện tại</span>
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-2xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Mật khẩu mới</span>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-2xl border border-[#d8dee9] bg-[#f1f4fa] px-4 py-3 font-medium text-[#181c20] outline-none focus:border-[#00488d] focus:ring-4 focus:ring-[#00488d]/10"
          />
        </label>

        {feedback ? (
          <div
            className={`md:col-span-2 rounded-2xl px-4 py-3 text-sm ${
              feedback.tone === "success"
                ? "border border-[#cce9da] bg-[#eef9f2] text-[#12603d]"
                : "border border-[#f1b7bc] bg-[#fff3f2] text-[#8f1d1d]"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="rounded-xl bg-[#00488d] hover:bg-[#005fb8]" disabled={isDisabled}>
            {changePasswordMutation.isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const { isChecking, session } = useSessionGuard();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      router.replace(`${ROUTES.login}?reason=logged-out`);
    },
  });

  if (isChecking || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f4f9] px-4">
        <div className="rounded-3xl border border-[#c2c6d4]/40 bg-white px-6 py-5 text-sm font-medium text-[#486176] shadow-sm">
          Đang kiểm tra phiên làm việc...
        </div>
      </main>
    );
  }

  const currentSession = session;

  function handleLogout() {
    logoutMutation.mutate({
      refreshToken: currentSession.refreshToken,
    });
  }

  return (
    <main className="min-h-screen bg-[#f1f4f9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[28px] bg-[#00488d] px-6 py-8 text-white shadow-[0_32px_64px_rgba(0,72,141,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">MTCRMS Secure Workspace</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold">Xin chào, {currentSession.user.fullName || "quân nhân"}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d6e3ff]">
                Bạn đã đăng nhập thành công. Không gian này dùng để xác minh redirect sau xác thực, trạng thái phiên và các
                hành động bảo mật đầu tiên trong module auth Phase 1.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                as="a"
                href={ROUTES.units}
                type="button"
                variant="secondary"
                className="h-11 rounded-full bg-white px-5 text-[#00488d] hover:bg-white/88"
              >
                Cơ cấu tổ chức
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-full bg-white/12 px-5 text-white hover:bg-white/18"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
              </Button>
            </div>
          </div>
        </header>

        <NoticeBanner />

        {currentSession.mustChangePassword ? <PasswordChangeCard /> : null}

        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Vai trò</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">{currentSession.user.roleCode || "Chưa có dữ liệu"}</p>
          </article>
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Định danh</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">{currentSession.user.mssq}</p>
          </article>
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Access token</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">Tự làm mới khi gần hết hạn</p>
          </article>
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Phiên</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">Tự động hết hạn sau 15 phút không hoạt động</p>
          </article>
        </section>
      </div>
    </main>
  );
}
