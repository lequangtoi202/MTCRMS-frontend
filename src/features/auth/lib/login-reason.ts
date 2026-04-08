export type LoginReason =
  | "account-locked"
  | "invalid-credentials"
  | "logged-out"
  | "password-reset-required"
  | "session-expired";

const reasonCopy: Record<LoginReason, { title: string; description: string; tone: "danger" | "info" }> = {
  "account-locked": {
    title: "Tài khoản đang bị khóa tạm thời",
    description: "Bạn đã nhập sai quá số lần cho phép. Liên hệ quản trị viên đơn vị để được hỗ trợ mở khóa.",
    tone: "danger",
  },
  "invalid-credentials": {
    title: "Thông tin đăng nhập không chính xác",
    description: "Kiểm tra lại MSSQ và mật khẩu trước khi thử lại.",
    tone: "danger",
  },
  "logged-out": {
    title: "Bạn đã đăng xuất",
    description: "Phiên làm việc đã được kết thúc an toàn.",
    tone: "info",
  },
  "password-reset-required": {
    title: "Cần đổi mật khẩu",
    description: "Tài khoản của bạn cần đổi mật khẩu ở lần đăng nhập đầu hoặc theo chu kỳ bảo mật.",
    tone: "info",
  },
  "session-expired": {
    title: "Phiên làm việc đã hết hạn",
    description: "Hệ thống tự đăng xuất sau 15 phút không hoạt động. Vui lòng xác thực lại để tiếp tục.",
    tone: "info",
  },
};

export function getLoginReasonCopy(reason: string | null) {
  if (!reason || !(reason in reasonCopy)) {
    return null;
  }

  return reasonCopy[reason as LoginReason];
}
