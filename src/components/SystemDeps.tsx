import { SectionPanel } from "./SectionPanel";
import { Terminal, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { api, SystemInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function SystemDeps() {
  const { t } = useI18n();
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemInfo();
      setInfo(data);
    } catch {}
    setLoading(false);
  };

  const deps: { key: keyof SystemInfo; label: string; required: boolean }[] = [
    { key: "lsblk", label: "lsblk (util-linux)", required: true },
    { key: "dd", label: "dd (coreutils)", required: true },
    { key: "udisks2", label: "udisksctl (udisks2)", required: false },
    { key: "smartctl", label: "smartctl (smartmontools)", required: false },
    { key: "b3sum", label: "b3sum (BLAKE3)", required: false },
  ];

  return (
    <SectionPanel title={t.sys_title} icon={<Terminal className="h-4 w-4" />}>
      {!info ? (
        <Button variant="outline" size="sm" onClick={load} disabled={loading}
          className="w-full font-mono text-xs border-border hover:border-primary hover:text-primary">
          {loading ? "Checking..." : t.sys_dependencies}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] font-mono text-muted-foreground mb-2">
            <span>Kernel: {info.kernel}</span>
            <span>Arch: {info.arch}</span>
            <span className="col-span-2 truncate">OS: {info.distro}</span>
          </div>
          {deps.map(d => {
            const ok = info[d.key] as boolean;
            return (
              <div key={d.key} className={cn(
                "flex items-center gap-2 p-1.5 rounded text-xs font-mono",
                ok ? "text-foreground" : d.required ? "text-destructive" : "text-muted-foreground"
              )}>
                {ok
                  ? <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                  : <XCircle className={cn("h-3.5 w-3.5 shrink-0", d.required ? "text-destructive" : "text-muted-foreground/50")} />
                }
                <span>{d.label}</span>
                <span className="ml-auto">
                  {ok ? t.sys_installed : d.required ? "⚠ " + t.sys_missing : t.sys_missing}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </SectionPanel>
  );
}
