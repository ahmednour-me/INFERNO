import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: number;
}

export function InfernoLogo({ className, size = 36 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-[0_0_8px_hsl(190_95%_50%_/0.5)]", className)}
    >
      <circle cx="32" cy="32" r="30" fill="#0d1117" stroke="hsl(190,95%,50%)" strokeWidth="2"/>
      <path
        d="M32 10 C28 18 20 20 22 30 C24 38 30 36 28 44 C30 40 36 38 34 30 C32 22 40 20 38 14 C36 18 34 16 32 10Z"
        fill="hsl(190,95%,50%)"
        opacity="0.95"
      />
      <path
        d="M26 32 C24 38 28 44 32 48 C36 44 38 38 36 32 C34 36 30 36 26 32Z"
        fill="#ff4444"
        opacity="0.75"
      />
      <ellipse cx="32" cy="50" rx="7" ry="2.5" fill="hsl(190,95%,50%)" opacity="0.25"/>
    </svg>
  );
}
