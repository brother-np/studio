import type { SVGProps } from "react";

export function MeroAppHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Mero App Hub Logo</title>
      <path d="M4 4l16 8-16 8V4z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M4 12h8" stroke="hsl(var(--primary-foreground))" />
    </svg>
  );
}
