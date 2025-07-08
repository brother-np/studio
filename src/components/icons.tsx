import type { SVGProps } from "react";

export function NepaliAppHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="24"
      height="24"
      {...props}
    >
      <title>Nepali App Hub Icon</title>
      <g>
        <rect width="64" height="64" rx="12" fill="hsl(var(--primary))" />
        <path d="M0 64 L0 50 L32 30 L64 50 L64 64 Z" fill="hsl(var(--accent))" />
        <path d="M32 30 L26 39 L38 39 Z" fill="#FFF" />
        <path
          d="M32 12 V 32 M22 24 L32 32 L42 24"
          stroke="#FFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
