/**
 * Minimal inline icon set — rounded strokes only, matching the logo's curves.
 * Kept local so the page ships no icon-library dependency.
 */
export type IconName =
  | "hospital"
  | "factory"
  | "office"
  | "glass"
  | "mall"
  | "school"
  | "calendar"
  | "team"
  | "pin"
  | "gauge"
  | "clipboard"
  | "supervisor"
  | "report"
  | "polisher"
  | "vacuum"
  | "washer"
  | "squeegee"
  | "cart"
  | "mop"
  | "bottle"
  | "check"
  | "arrow"
  | "phone"
  | "mail"
  | "whatsapp"
  | "globe"
  | "shield"
  | "leaf"
  | "up"
  | "plus"
  | "menu"
  | "close";

const P: Record<IconName, React.ReactNode> = {
  hospital: (
    <>
      <path d="M4 20V9.5a2 2 0 0 1 .9-1.7l6-3.9a2 2 0 0 1 2.2 0l6 3.9a2 2 0 0 1 .9 1.7V20" />
      <path d="M2.5 20h19M12 9.5v5M9.5 12h5" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20V11l5.5 3.5V11L14 14.5V8l6.5 4.2V20" />
      <path d="M2 20h20M7 8V4M7 4h3" />
    </>
  ),
  office: (
    <>
      <rect x="4" y="3.5" width="12" height="17" rx="3" />
      <path d="M16 9h3a2 2 0 0 1 2 2v9M2.5 20.5h19M8 8h4M8 12h4M8 16h4" />
    </>
  ),
  glass: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="4" />
      <path d="M3 10h18M12 3.5v17" />
      <path d="M15.5 14.5c1.6-1 3-.6 3.8.5" />
    </>
  ),
  mall: (
    <>
      <path d="M4 9h16l-1 11.5H5L4 9Z" />
      <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </>
  ),
  school: (
    <>
      <path d="M12 3.5 22 8l-10 4.5L2 8l10-4.5Z" />
      <path d="M6 10.5V16c0 1.7 2.7 3.2 6 3.2s6-1.5 6-3.2v-5.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="4" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5.4a3.2 3.2 0 0 1 0 5.2M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4.2-4.6" />
      <circle cx="12" cy="17" r="1.4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="4.5" y="4" width="15" height="17" rx="4" />
      <path d="M9 4.2a3 3 0 0 1 6 0M8.5 11h7M8.5 15h4.5" />
    </>
  ),
  supervisor: (
    <>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M5 20.5a7 7 0 0 1 14 0" />
      <path d="M18.5 4.5 21 7l-2.5 2.5" />
    </>
  ),
  report: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="4" />
      <path d="M8.5 15.5v-3M12 15.5v-6M15.5 15.5v-4.5" />
    </>
  ),
  polisher: (
    <>
      <circle cx="9" cy="16.5" r="4" />
      <path d="M12.5 14 18 5.5M16.5 4.5h4.5" />
    </>
  ),
  vacuum: (
    <>
      <rect x="3" y="10" width="10" height="9" rx="4" />
      <path d="M13 13.5h3.5a3.5 3.5 0 0 0 3.5-3.5V5" />
      <circle cx="8" cy="14.5" r="1.6" />
    </>
  ),
  washer: (
    <>
      <path d="M3.5 18.5h17" />
      <rect x="6" y="11" width="9" height="6" rx="3" />
      <path d="M15 13.5h4V7.5M12 11V6.5h5" />
    </>
  ),
  squeegee: (
    <>
      <path d="M4 19.5h11" />
      <path d="M5.5 16.5h8v3h-8z" />
      <path d="M9.5 16.5 17 5.5M15.5 4h4.5" />
    </>
  ),
  cart: (
    <>
      <rect x="4" y="7.5" width="13" height="9" rx="3.5" />
      <path d="M17 11h3v5.5" />
      <circle cx="7.5" cy="19.5" r="1.6" />
      <circle cx="16.5" cy="19.5" r="1.6" />
    </>
  ),
  mop: (
    <>
      <path d="M12 3v10" />
      <path d="M7.5 13h9l-1.3 6.5H8.8L7.5 13Z" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3.5h4v3l2 2.5v9a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V9l2-2.5v-3Z" />
      <path d="M8 13h8" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  arrow: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="4" />
      <path d="m4 8 7.1 4.7a2 2 0 0 0 2.2 0L20 8" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.8 20.2 5 16.4A8 8 0 1 1 8 19.2l-4.2 1Z" />
      <path d="M9 9c0 3 2.2 5.2 5 5.6.8.1 1.4-.5 1.4-1.2v-.6l-1.8-.8-.8.9c-1-.5-1.8-1.3-2.2-2.3l.9-.8-.8-1.8h-.6C9.5 8 9 8.4 9 9Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c4 4.5 4 12.5 0 17M12 3.5c-4 4.5-4 12.5 0 17" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19 6v6c0 4.2-3 7.4-7 8.8-4-1.4-7-4.6-7-8.8V6l7-2.8Z" />
      <path d="m9 12 2 2 4-4.2" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 9-5 12-9.5 12A4.5 4.5 0 0 1 6 11.5C6 7 9 4 20 4Z" />
      <path d="M5 20c1.5-4 4-6.5 8-8.5" />
    </>
  ),
  up: (
    <>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
};

export function Icon({
  name,
  className = "size-6",
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  );
}
