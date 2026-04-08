import type { SVGProps } from "react";

type AuthIconName = "shield" | "badge" | "lock" | "login" | "verified" | "admin" | "timer" | "security";

type AuthIconProps = SVGProps<SVGSVGElement> & {
  name: AuthIconName;
};

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function AuthIcon({ name, className, ...props }: Readonly<AuthIconProps>) {
  switch (name) {
    case "shield":
      return (
        <svg {...baseProps} className={className} {...props}>
          <path d="M12 3l7 3v5c0 4.5-2.8 8.6-7 10-4.2-1.4-7-5.5-7-10V6l7-3z" />
          <path d="M12 8v7" />
          <path d="M9.5 11.5h5" />
        </svg>
      );
    case "badge":
      return (
        <svg {...baseProps} className={className} {...props}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h8" />
          <path d="M8 14h4" />
          <circle cx="15.5" cy="14.5" r="2.5" />
        </svg>
      );
    case "lock":
      return (
        <svg {...baseProps} className={className} {...props}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7.5A4 4 0 0112 4a4 4 0 014 3.5V10" />
          <path d="M12 14v2.5" />
        </svg>
      );
    case "login":
      return (
        <svg {...baseProps} className={className} {...props}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H4" />
          <path d="M20 4v16" />
        </svg>
      );
    case "verified":
      return (
        <svg {...baseProps} className={className} {...props}>
          <path d="M12 3l2.3 1.5 2.7.2 1.2 2.4 2.1 1.7-.7 2.6.7 2.6-2.1 1.7-1.2 2.4-2.7.2L12 21l-2.3-1.5-2.7-.2-1.2-2.4-2.1-1.7.7-2.6-.7-2.6 2.1-1.7 1.2-2.4 2.7-.2L12 3z" />
          <path d="M9 12.5l2 2 4-5" />
        </svg>
      );
    case "admin":
      return (
        <svg {...baseProps} className={className} {...props}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 19a6 6 0 0112 0" />
          <path d="M18.5 6.5l1 1 2-2" />
        </svg>
      );
    case "timer":
      return (
        <svg {...baseProps} className={className} {...props}>
          <circle cx="12" cy="13" r="7" />
          <path d="M12 13V9.5" />
          <path d="M12 13l2.5 1.5" />
          <path d="M9 3h6" />
        </svg>
      );
    case "security":
      return (
        <svg {...baseProps} className={className} {...props}>
          <path d="M12 3l6 2.5v5.5c0 3.8-2.3 7.2-6 8.5-3.7-1.3-6-4.7-6-8.5V5.5L12 3z" />
          <path d="M10 11.5l1.5 1.5 3-3" />
        </svg>
      );
    default:
      return null;
  }
}
