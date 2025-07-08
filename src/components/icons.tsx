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
          d="M0 64 L0 54 L12 50 L32 32 L52 50 L64 54 L64 64 Z"
          fill="hsl(var(--accent))"
        />
        <path d="M12 50 L32 32 L52 50 L32 44 Z" fill="#FFF" />
        <path
          d="M28 8 L36 8 L36 18 L42 18 L32 26 L22 18 L28 18 Z"
          fill="#FFF"
        />
      </g>
    </svg>
  );
}
