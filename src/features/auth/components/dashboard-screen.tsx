"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

import { clearSession } from "../lib/auth-session";
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
        Backend đã đánh dấu tài khoản cần đổi mật khẩu. Luồng thay đổi mật khẩu sẽ được kích hoạt khi endpoint tương
        ứng sẵn sàng.
      </p>
    </div>
  );
}

export function DashboardScreen() {
  const router = useRouter();
  const { isChecking, session } = useSessionGuard();

  if (isChecking || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f4f9] px-4">
        <div className="rounded-3xl border border-[#c2c6d4]/40 bg-white px-6 py-5 text-sm font-medium text-[#486176] shadow-sm">
          Đang kiểm tra phiên làm việc...
        </div>
      </main>
    );
  }

  function handleLogout() {
    clearSession();
    router.replace(`${ROUTES.login}?reason=logged-out`);
  }

  return (
    <main className="min-h-screen bg-[#f1f4f9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[28px] bg-[#00488d] px-6 py-8 text-white shadow-[0_32px_64px_rgba(0,72,141,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">MTCRMS Secure Workspace</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold">Xin chào, {session.user?.name || "quân nhân"}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d6e3ff]">
                Bạn đã đăng nhập thành công. Màn hình này đóng vai trò protected entry point để kiểm tra redirect sau
                xác thực, trạng thái phiên và tự động đăng xuất khi hết hạn.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-full bg-white/12 px-5 text-white hover:bg-white/18"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </header>

        <NoticeBanner />

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Vai trò</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">{session.user?.role || "Chưa có dữ liệu"}</p>
          </article>
          <article className="rounded-3xl border border-[#c2c6d4]/40 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#727783]">Đơn vị</p>
            <p className="mt-4 text-lg font-semibold text-[#181c20]">{session.user?.unitName || "Chưa có dữ liệu"}</p>
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
