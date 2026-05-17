import { SectionPanel } from "./SectionPanel";
import { Stethoscope, Activity, Thermometer, Zap, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api, SmartHealth } from "@/lib/api";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface Props {
  device: string | null;
}

export function DriveHealth({ device }: Props) {
  const { t } = useI18n();
  const [health, setHealth] = useState<SmartHealth | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async () => {
    if (!device) return;
    setScanning(true);
    setHealth(null);
    setError(null);
    try {
      const h = await api.getSmartHealth(device);
      setHealth(h);
    } catch (e) {
      setError(String(e));
    } finally {
      setScanning(false);
    }
  };

  const statusIcon = health
    ? health.status === "healthy"
      ? <CheckCircle className="h-4 w-4 text-success" />
      : health.status === "fail"
      ? <XCircle className="h-4 w-4 text-destructive" />
      : <AlertTriangle className="h-4 w-4 text-warning" />
    : null;

  return (
    <SectionPanel title={t.health_title} icon={<Stethoscope className="h-4 w-4" />}>
      <div className="space-y-3">
        <Button
          onClick={scan}
          disabled={scanning || !device}
          variant="outline"
          className="w-full border-border hover:border-primary hover:text-primary font-mono text-xs"
        >
          <Activity className={cn("h-3.5 w-3.5 mr-2", scanning && "animate-pulse")} />
          {scanning ? t.health_running : t.health_run}
        </Button>

        {!health && !scanning && !error && (
          <div className="flex flex-col items-center justify-center py-5 rounded-md border border-dashed border-border bg-secondary/20">
            <Stethoscope className="h-5 w-5 text-muted-foreground/60 mb-1.5" />
            <p className="text-xs font-mono text-muted-foreground">{t.health_no_device}</p>
          </div>
        )}

        {error && <p className="text-xs font-mono text-destructive">{error}</p>}

        {health && (
          <div className="space-y-2">
            <div className={cn(
              "flex items-center gap-2 p-2.5 rounded-md border text-xs font-mono",
              health.status === "healthy" ? "border-success/30 bg-success/5 text-success" :
              health.status === "fail" ? "border-destructive/30 bg-destructive/5 text-destructive" :
              "border-warning/30 bg-warning/5 text-warning"
            )}>
              {statusIcon}
              <span>{health.overall}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {health.temp_c !== null && (
                <Stat icon={<Thermometer className="h-3 w-3" />} label={t.health_temp} value={`${health.temp_c} °C`} warn={health.temp_c > 55} />
              )}
              {health.power_on_hours !== null && (
                <Stat icon={<Clock className="h-3 w-3" />} label={t.health_power_on} value={`${health.power_on_hours} h`} />
              )}
              {health.reallocated_sectors !== null && (
                <Stat icon={<Zap className="h-3 w-3" />} label={t.health_reallocated} value={String(health.reallocated_sectors)} warn={health.reallocated_sectors > 0} />
              )}
              {health.pending_sectors !== null && (
                <Stat icon={<Zap className="h-3 w-3" />} label={t.health_pending} value={String(health.pending_sectors)} warn={health.pending_sectors > 0} />
              )}
            </div>
          </div>
        )}
      </div>
    </SectionPanel>
  );
}

function Stat({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("p-2 rounded-md bg-secondary/40 border", warn ? "border-warning/40" : "border-border")}>
      <p className={cn("text-[9px] font-mono uppercase tracking-wider flex items-center gap-1", warn ? "text-warning" : "text-muted-foreground")}>
        {icon} {label}
      </p>
      <p className={cn("text-sm font-mono mt-0.5", warn ? "text-warning" : "text-foreground")}>{value}</p>
    </div>
  );
}
