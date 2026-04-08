"use client";

import { useSearchParams } from "next/navigation";

import { getLoginReasonCopy } from "../lib/login-reason";

import { AuthIcon } from "./auth-icon";
import { LoginForm } from "./login-form";

const supportItems = [
  {
    icon: "verified" as const,
    iconClassName: "text-primary",
    text: "Vui lòng đổi mật khẩu định kỳ để đảm bảo an toàn thông tin.",
  },
  {
    icon: "admin" as const,
    iconClassName: "text-primary",
    text: "Liên hệ quản trị viên đơn vị nếu cần cấp lại mật khẩu hoặc mở khóa tài khoản.",
  },
  {
    icon: "timer" as const,
    iconClassName: "text-tertiary",
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
          ? "border-[rgb(255,218,214)] bg-[rgb(255,243,242)] text-[rgb(147,0,10)]"
          : "border-[rgb(194,198,212)] bg-[rgb(241,244,250)] text-on-surface-variant",
      ].join(" ")}
    >
      <p className="font-semibold">{reason.title}</p>
      <p className="mt-1 leading-relaxed">{reason.description}</p>
    </div>
  );
}

export function LoginScreen() {
  return (
    <div className="min-h-screen bg-background px-4 py-4 sm:px-6 sm:py-6">
      <main className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-outline-variant/30 bg-white shadow-[0_28px_80px_rgba(11,30,63,0.12)] lg:grid-cols-[1.02fr_1fr]">
        <section className="military-grid relative hidden min-h-full overflow-hidden bg-primary px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-12 xl:py-14">
          <div className="relative z-10">
            <div className="mb-14 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm">
                <AuthIcon name="shield" className="h-[30px] w-[30px] text-white" />
              </div>
              <div>
                <div className="font-heading text-[30px] font-extrabold tracking-tight text-white">MTCRMS</div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  Secure Military Platform
                </p>
              </div>
            </div>

            <div className="max-w-[440px]">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-white/60">Cổng xác thực tập trung</p>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.12] tracking-tight text-white xl:text-[52px]">
                Hệ thống Quản lý Huấn luyện
                <br />
                và Sẵn sàng Chiến đấu
              </h1>
              <div className="my-8 h-1 w-18 rounded-full bg-on-primary-container" />
              <p className="max-w-[390px] text-base leading-8 text-on-primary-container/88">
                Nền tảng kỹ thuật số phục vụ công tác điều hành, quản lý quân số và duy trì trạng thái sẵn sàng chiến đấu
                trong toàn quân.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-end gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
              <AuthIcon name="security" className="h-6 w-6 text-white/90" />
            </div>
            <div className="text-xs font-bold uppercase leading-relaxed tracking-[0.22em] text-white/72">
              Hệ thống bảo mật quốc gia
              <br />
              Dành cho quân nhân
            </div>
          </div>

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-white/8" />
          <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full border border-white/6" />
          <div className="absolute top-20 right-[-90px] h-72 w-72 rounded-full bg-[#2f7dd1]/18 blur-3xl" />
        </section>

        <section className="flex min-h-full flex-col justify-center bg-white px-6 py-10 sm:px-8 md:px-12 md:py-12 lg:px-14 xl:px-16">
          <div className="mx-auto w-full max-w-[420px]">
            <header className="mb-10">
              <div className="mb-6 flex items-center gap-4 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-[0_12px_24px_rgba(0,72,141,0.18)]">
                  <AuthIcon name="shield" className="h-[26px] w-[26px] text-white" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-extrabold tracking-tight text-primary">MTCRMS</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary/80">Xác thực quân nhân</p>
                </div>
              </div>

              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface md:text-[40px]">Đăng nhập tài khoản</h2>
              <p className="mt-3 text-[15px] leading-7 text-on-surface-variant">Vui lòng xác thực định danh quân nhân để truy cập hệ thống.</p>
            </header>

            <ReasonBanner />
            <LoginForm />

            <div className="mt-8 space-y-4 border-t border-outline-variant/30 pt-6">
              {supportItems.map((item) => (
                <div key={item.text} className="grid grid-cols-[20px_1fr] items-start gap-3">
                  <AuthIcon name={item.icon} className={`mt-0.5 h-[18px] w-[18px] ${item.iconClassName}`} />
                  <p className="text-sm leading-6 text-on-surface-variant">{item.text}</p>
                </div>
              ))}
            </div>

            <footer className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              <a
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:text-primary"
                href="#"
              >
                Quy định bảo mật
              </a>
              <a
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary transition-colors hover:text-primary"
                href="#"
              >
                Hỗ trợ kỹ thuật
              </a>
            </footer>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-6 flex w-full max-w-[1120px] flex-col gap-3 px-2 text-center sm:px-0 lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
          © 2024 MTCRMS - Cục Quân lực / Bộ Tổng Tham mưu
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/60 lg:justify-end">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
            <span>Kênh truyền dẫn an toàn</span>
          </div>
          <div className="h-3 w-px bg-outline-variant" />
          <span>Phiên bản 2.4.0</span>
        </div>
      </footer>
    </div>
  );
}
