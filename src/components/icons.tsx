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
        <path
          d="M0 64 L0 42 C 12 36, 24 38, 32 44 C 40 50, 52 50, 64 42 L64 64 Z"
          fill="hsl(var(--accent))"
        />
        <path
          d="M14 54 L32 22 L50 54 L32 46 Z"
          fill="#FFFFFF"
        />
         <path
          d="M32 22 L50 54 L32 46 Z"
          fill="#FFFFFF"
          fillOpacity="0.7"
        />
      </g>
    </svg>
  );
}
