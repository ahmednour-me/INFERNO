import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionPanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  glowing?: boolean;
  className?: string;
}

export function SectionPanel({ title, icon, children, glowing = false, className }: SectionPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-all duration-200",
        glowing ? "border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.1)]" : "border-border",
        className
      )}
    >
      <div className={cn(
        "flex items-center gap-2.5 px-4 py-2.5 border-b text-[10px] font-mono uppercase tracking-[0.15em]",
        glowing ? "border-primary/20 bg-primary/5 text-primary" : "border-border bg-secondary/30 text-muted-foreground"
      )}>
        {icon && <span className={glowing ? "text-primary" : "text-muted-foreground"}>{icon}</span>}
        <span>{title}</span>
        {glowing && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
