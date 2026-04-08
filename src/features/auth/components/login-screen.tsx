"use client";

import { useSearchParams } from "next/navigation";

import { getLoginReasonCopy } from "../lib/login-reason";

import { LoginForm } from "./login-form";

const supportItems = [
  {
    icon: "verified_user",
    iconClassName: "text-[#00488d]",
    text: "Vui lòng đổi mật khẩu định kỳ để đảm bảo bảo mật.",
  },
  {
    icon: "admin_panel_settings",
    iconClassName: "text-[#00488d]",
    text: "Liên hệ quản trị viên đơn vị để được cấp lại mật khẩu.",
  },
  {
    icon: "timer",
    iconClassName: "text-[#930039]",
    text: "Hệ thống sẽ tự động đăng xuất sau 15 phút không hoạt động.",
  },
];

function ReasonBanner() {
  const searchParams = useSearchParams();
  const reason = getLoginReasonCopy(searchParams.get("reason"));

  if (!reason) {
    return null;
  }

  return (
    <div
      className={[
        "mb-6 rounded-2xl border px-4 py-3 text-sm",
        reason.tone === "danger"
          ? "border-[#f1b7bc] bg-[#fff3f2] text-[#8f1d1d]"
          : "border-[#c9d6ea] bg-[#f4f8ff] text-[#324657]",
      ].join(" ")}
    >
      <p className="font-semibold">{reason.title}</p>
      <p className="mt-1 leading-6">{reason.description}</p>
    </div>
  );
}

export function LoginScreen() {
  return (
    <main className="min-h-screen bg-[#f1f4f9] px-4 py-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1100px] flex-col justify-center">
        <section className="grid overflow-hidden rounded-[20px] border border-[#c2c6d4]/30 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.08)] md:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-[#00488d] p-12 md:flex md:flex-col md:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:40px_40px]" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full border border-white/5" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full border border-white/5" />
            <div className="absolute top-1/2 right-0 h-48 w-48 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                  <span className="material-symbols-outlined text-2xl text-white">shield_person</span>
                </div>
                <div className="font-heading text-2xl font-extrabold tracking-tight text-white">MTCRMS</div>
              </div>

              <h1 className="max-w-lg font-heading text-3xl font-extrabold leading-tight text-white">
                Hệ thống Quản lý Huấn luyện &amp; Sẵn sàng Chiến đấu (MTCRMS)
              </h1>
              <div className="mb-6 mt-6 h-1 w-16 rounded-full bg-[#cadcff]" />
              <p className="max-w-sm text-base leading-8 text-[#cadcff]/85">
                Nền tảng kỹ thuật số chính quy phục vụ công tác điều hành, quản lý quân số và duy trì trạng thái sẵn
                sàng chiến đấu trong toàn quân.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-4 text-white/70">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <span className="material-symbols-outlined">security</span>
              </div>
              <p className="text-xs font-bold uppercase leading-tight tracking-[0.24em]">
                Hệ thống bảo mật quốc gia
                <br />
                Dành cho quân nhân
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white px-8 py-10 md:px-14">
            <div className="mx-auto w-full max-w-sm">
              <header className="mb-10 text-center md:text-left">
                <div className="mb-6 flex justify-center md:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00488d]">
                    <span className="material-symbols-outlined text-white">shield_person</span>
                  </div>
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-[#181c20]">Đăng nhập tài khoản</h2>
                <p className="mt-2 text-sm font-medium text-[#424752]">Vui lòng xác thực định danh quân nhân</p>
              </header>

              <ReasonBanner />
              <LoginForm />

              <div className="mt-8 space-y-3 border-t border-[#c2c6d4]/30 pt-6">
                {supportItems.map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-[18px] ${item.iconClassName}`}>{item.icon}</span>
                    <p className="text-xs leading-6 text-[#424752]">{item.text}</p>
                  </div>
                ))}
              </div>

              <footer className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
                <a
                  className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#486176] transition-colors hover:text-[#00488d]"
                  href="#"
                >
                  Quy định bảo mật
                </a>
                <a
                  className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#486176] transition-colors hover:text-[#00488d]"
                  href="#"
                >
                  Hỗ trợ kỹ thuật
                </a>
              </footer>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424752]/60">
            © 2024 MTCRMS - Cục Quân Lực / Bộ Tổng Tham Mưu
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424752]/60">
                Kênh truyền dẫn an toàn
              </span>
            </div>
            <div className="h-3 w-px bg-[#c2c6d4]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#424752]/60">Phiên bản 2.4.0</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
