import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";

interface StatusIndicatorProps {
  status: "ready" | "busy" | "error" | "idle";
  label?: string;
  className?: string;
}

const statusConfig = {
  ready:  { color: "bg-success",          pulse: true,  key: "status_ready" as const },
  busy:   { color: "bg-warning",          pulse: true,  key: "status_busy" as const },
  error:  { color: "bg-destructive",      pulse: false, key: "status_error" as const },
  idle:   { color: "bg-muted-foreground", pulse: false, key: "status_idle" as const },
};

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const { t } = useI18n();
  const config = statusConfig[status];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", config.color, config.pulse && "animate-pulse")} />
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        {label || t[config.key]}
      </span>
    </div>
  );
}
