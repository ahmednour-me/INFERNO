import { SectionPanel } from "./SectionPanel";
import { HardDrive, RefreshCw, AlertTriangle, Usb, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback } from "react";
import { api, UsbDrive } from "@/lib/api";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

interface Props {
  onSelect?: (drive: UsbDrive | null) => void;
}

export function USBDriveSelector({ onSelect }: Props) {
  const { t } = useI18n();
  const [drives, setDrives] = useState<UsbDrive[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drive = drives.find(d => d.path === selected) ?? null;

  const rescan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const list = await api.listUsbDrives();
      setDrives(list);
      if (list.length > 0 && !list.find(d => d.path === selected)) {
        setSelected("");
        onSelect?.(null);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setScanning(false);
    }
  }, [selected, onSelect]);

  const handleSelect = (path: string) => {
    setSelected(path);
    const d = drives.find(x => x.path === path) ?? null;
    onSelect?.(d);
  };

  return (
    <SectionPanel title={t.usb_title} icon={<HardDrive className="h-4 w-4" />}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Select value={selected} onValueChange={handleSelect} disabled={drives.length === 0}>
            <SelectTrigger className="flex-1 bg-secondary border-border font-mono text-sm">
              <SelectValue placeholder={drives.length ? t.usb_select : t.usb_no_devices} />
            </SelectTrigger>
            <SelectContent>
              {drives.map(d => (
                <SelectItem key={d.path} value={d.path} className="font-mono text-sm">
                  {d.name} — {d.size} [{d.path}]
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={rescan}
            title={t.usb_refresh}
            className="shrink-0 border-border hover:border-primary hover:text-primary"
          >
            <RefreshCw className={cn("h-4 w-4", scanning && "animate-spin")} />
          </Button>
        </div>

        {error && (
          <p className="text-xs font-mono text-destructive">{error}</p>
        )}

        {drives.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-6 px-3 rounded-md border border-dashed border-border bg-secondary/20 text-center">
            <Usb className="h-6 w-6 text-muted-foreground/60 mb-2" />
            <p className="text-xs font-mono text-muted-foreground">{t.usb_no_devices_hint}</p>
            <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">Requires udisks2 / lsblk</p>
          </div>
        )}

        {drive && (
          <>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-md bg-secondary/50 border border-border">
              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{t.usb_device}</p>
                <p className="text-sm font-mono text-foreground">{drive.path}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{t.usb_bus}</p>
                <p className="text-sm font-mono text-foreground truncate">{drive.bus}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{t.usb_capacity}</p>
                <p className="text-sm font-mono text-primary">{drive.size}</p>
              </div>
            </div>

            {drive.mounted && (
              <div className="flex items-center gap-2 text-info text-xs">
                <CheckCircle className="h-3 w-3" />
                <span className="font-mono">{t.usb_mounted}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-warning text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span className="font-mono">{t.usb_warning}</span>
            </div>
          </>
        )}
      </div>
    </SectionPanel>
  );
}
