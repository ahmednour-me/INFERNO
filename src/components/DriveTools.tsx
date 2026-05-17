import { SectionPanel } from "./SectionPanel";
import { Wrench, Eraser, Copy, Save, FileArchive, FlaskConical, Layers, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api, saveFileDialog } from "@/lib/api";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface Props {
  device: string | null;
}

interface ToolResult {
  success: boolean;
  message: string;
}

export function DriveTools({ device }: Props) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [benchResult, setBenchResult] = useState<{ read: number; write: number } | null>(null);

  const run = async (toolId: string, fn: () => Promise<ToolResult>) => {
    setBusy(toolId);
    setResult(null);
    setBenchResult(null);
    try {
      const r = await fn();
      setResult(r);
    } catch (e) {
      setResult({ success: false, message: String(e) });
    } finally {
      setBusy(null);
    }
  };

  const handleWipe = () => {
    if (!device) return setResult({ success: false, message: "No device selected" });
    run("wipe", async () => {
      const r = await api.secureWipeDevice(device, 1);
      return { success: r.success, message: r.success ? "Wipe complete" : r.stderr };
    });
  };

  const handleBackup = () => {
    if (!device) return setResult({ success: false, message: "No device selected" });
    run("backup", async () => {
      const path = await saveFileDialog({ title: "Save backup image", defaultPath: "backup.img", filters: [{ name: "Disk Image", extensions: ["img", "gz"] }] });
      if (!path) return { success: false, message: "Cancelled" };
      const r = await api.backupToImage(device, path, false);
      return { success: r.success, message: r.success ? `Backup saved to ${path}` : r.stderr };
    });
  };

  const handleBenchmark = () => {
    if (!device) return setResult({ success: false, message: "No device selected" });
    run("benchmark", async () => {
      const r = await api.benchmarkDrive(device);
      setBenchResult({ read: r.read_mb, write: r.write_mb });
      return { success: true, message: `Read: ${r.read_mb.toFixed(1)} MB/s · Write: ${r.write_mb.toFixed(1)} MB/s` };
    });
  };

  const handleVentoy = () => {
    if (!device) return setResult({ success: false, message: "No device selected" });
    run("ventoy", async () => {
      const r = await api.installVentoy(device, true);
      return { success: r.success, message: r.success ? "Ventoy installed successfully" : r.stderr };
    });
  };

  const tools = [
    { id: "wipe", icon: Eraser, label: t.tools_wipe, desc: t.tools_wipe_desc, action: handleWipe },
    { id: "backup", icon: Save, label: t.tools_backup, desc: t.tools_backup_desc, action: handleBackup },
    { id: "benchmark", icon: FlaskConical, label: t.tools_benchmark, desc: t.tools_benchmark_desc, action: handleBenchmark },
    { id: "ventoy", icon: Layers, label: t.tools_ventoy, desc: t.tools_ventoy_desc, action: handleVentoy },
    { id: "clone", icon: Copy, label: t.tools_clone, desc: t.tools_clone_desc, action: () => setResult({ success: false, message: "Select source and destination in the forge tab" }) },
    { id: "restore", icon: FileArchive, label: t.tools_restore, desc: t.tools_restore_desc, action: () => setResult({ success: false, message: "Use ISO Selector to restore an image" }) },
  ];

  return (
    <SectionPanel title={t.tools_title} icon={<Wrench className="h-4 w-4" />}>
      <div className="grid grid-cols-1 gap-1.5">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant="ghost"
            disabled={busy !== null}
            onClick={tool.action}
            className={cn(
              "justify-start h-auto py-2 px-2.5 hover:bg-secondary/60 group",
              busy === tool.id && "opacity-70"
            )}
          >
            <tool.icon className={cn("h-3.5 w-3.5 mr-2.5 shrink-0", busy === tool.id ? "animate-pulse text-warning" : "text-primary")} />
            <div className="text-left">
              <p className="text-xs font-mono text-foreground">{tool.label}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{tool.desc}</p>
            </div>
            {busy === tool.id && <span className="ml-auto text-[10px] font-mono text-warning">running...</span>}
          </Button>
        ))}
      </div>

      {result && (
        <div className={cn(
          "mt-3 p-2.5 rounded-md border text-xs font-mono flex items-start gap-2",
          result.success ? "border-success/30 bg-success/5 text-success" : "border-destructive/30 bg-destructive/5 text-destructive"
        )}>
          {result.success ? <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> : <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
          <span>{result.message}</span>
        </div>
      )}

      {benchResult && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="p-2 rounded-md bg-secondary/40 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase">Read</p>
            <p className="text-sm font-mono text-primary">{benchResult.read.toFixed(1)} MB/s</p>
          </div>
          <div className="p-2 rounded-md bg-secondary/40 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase">Write</p>
            <p className="text-sm font-mono text-primary">{benchResult.write.toFixed(1)} MB/s</p>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}
