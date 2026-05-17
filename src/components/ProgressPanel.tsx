import { SectionPanel } from "./SectionPanel";
import { Activity, Play, Square, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react";
import { StatusIndicator } from "./StatusIndicator";
import { api, WriteProgress, listenEvent } from "@/lib/api";
import { useI18n } from "@/i18n";

interface Props {
  device: string | null;
  isoPath: string | null;
}

export function ProgressPanel({ device, isoPath }: Props) {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "busy" | "error">("idle");
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState("--:--");
  const logEndRef = useRef<HTMLDivElement>(null);
  const unlistenRef = useRef<(() => void) | null>(null);

  const ready = !!(device && isoPath);

  useEffect(() => {
    if (ready) setStatus("ready");
    else setStatus("idle");
  }, [ready]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Subscribe to Tauri write-progress events
  useEffect(() => {
    if (!running) return;
    let cancelled = false;

    listenEvent<WriteProgress>("write-progress", (payload) => {
      if (cancelled) return;
      setProgress(payload.percent);
      setSpeed(Math.round(payload.speed_mb * 10) / 10);
      if (payload.eta_secs > 0) {
        const m = Math.floor(payload.eta_secs / 60);
        const s = payload.eta_secs % 60;
        setEta(`${m}:${String(s).padStart(2, "0")}`);
      }
      if (payload.log_line) {
        setLogs(prev => [...prev, payload.log_line]);
      }
      if (payload.percent >= 100) {
        setRunning(false);
        setStatus("ready");
      }
    }).then(unlisten => {
      unlistenRef.current = unlisten;
    });

    return () => {
      cancelled = true;
      unlistenRef.current?.();
    };
  }, [running]);

  const start = async () => {
    if (!device || !isoPath) {
      setLogs(["[err] Select a USB device and ISO image first."]);
      return;
    }
    setRunning(true);
    setStatus("busy");
    setLogs(["[info] Starting write operation..."]);
    setProgress(0);
    setSpeed(0);
    setEta("--:--");

    try {
      await api.startWriteIso({
        isoPath,
        device,
        writeMode: "iso",
        bufferMb: 32,
        verifyAfter: true,
      });
    } catch (e) {
      setLogs(prev => [...prev, `[err] ${String(e)}`]);
      setStatus("error");
      setRunning(false);
    }
  };

  const abort = () => {
    setRunning(false);
    setStatus("ready");
    setLogs(prev => [...prev, "[warn] Operation aborted by user."]);
    unlistenRef.current?.();
  };

  const formatEta = (s: string) => s;

  return (
    <SectionPanel title={t.op_title} icon={<Activity className="h-4 w-4" />}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StatusIndicator status={status} />
          <div className="flex gap-2">
            <Button
              onClick={start}
              disabled={running || !ready}
              className="font-mono text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              size="sm"
            >
              <Play className="h-3 w-3 mr-1.5" />
              {running ? t.op_writing : t.op_start}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!running}
              onClick={abort}
              className="font-mono text-xs border-border hover:border-destructive hover:text-destructive"
            >
              <Square className="h-3 w-3 mr-1.5" />
              {t.op_abort}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 rounded bg-secondary/40 border border-border">
            <p className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">{t.op_progress}</p>
            <p className="text-sm font-mono text-primary">{Math.round(progress)}%</p>
          </div>
          <div className="p-1.5 rounded bg-secondary/40 border border-border">
            <p className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">{t.op_speed}</p>
            <p className="text-sm font-mono text-foreground">{speed} MB/s</p>
          </div>
          <div className="p-1.5 rounded bg-secondary/40 border border-border">
            <p className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">{t.op_eta}</p>
            <p className="text-sm font-mono text-foreground">{eta}</p>
          </div>
        </div>

        <div className="relative">
          <Progress value={progress} className="h-2 bg-secondary" />
          {running && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
            </div>
          )}
        </div>

        <div className="h-32 rounded-md bg-background border border-border p-2 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs font-mono text-muted-foreground/50 flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> {t.op_idle}
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              {logs.map((log, i) => (
                <p key={i} className={`text-[11px] font-mono leading-relaxed ${
                  log.includes("[ok]") ? "text-success" :
                  log.includes("[err]") ? "text-destructive" :
                  log.includes("[warn]") ? "text-warning" :
                  "text-muted-foreground"
                }`}>
                  {log}
                </p>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
    </SectionPanel>
  );
}
