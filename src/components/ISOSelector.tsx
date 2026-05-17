import { SectionPanel } from "./SectionPanel";
import { Disc, FolderOpen, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { openFileDialog } from "@/lib/api";
import { useI18n } from "@/i18n";

interface ISOFile {
  id: string;
  name: string;
  size: string;
  type: string;
  path: string;
}

function formatSize(bytes: number) {
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB";
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

function detectType(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ubuntu") || n.includes("debian") || n.includes("mint")) return "Linux · Debian";
  if (n.includes("fedora") || n.includes("rhel") || n.includes("centos")) return "Linux · RHEL";
  if (n.includes("arch") || n.includes("manjaro")) return "Linux · Arch";
  if (n.includes("kali") || n.includes("parrot") || n.includes("tails")) return "Security";
  if (n.includes("win")) return "Windows";
  if (n.endsWith(".img")) return "Raw Image";
  return "ISO Image";
}

interface Props {
  onIsoSelect?: (paths: string[]) => void;
}

export function ISOSelector({ onIsoSelect }: Props) {
  const { t } = useI18n();
  const [multiboot, setMultiboot] = useState(false);
  const [isos, setIsos] = useState<ISOFile[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tauri native file dialog
  const openNative = async () => {
    const paths = await openFileDialog({
      title: "Select ISO / IMG",
      filters: [{ name: "Disk Images", extensions: ["iso", "img", "efi", "bin"] }],
      multiple: multiboot,
    });
    if (paths && paths.length > 0) {
      const next: ISOFile[] = paths.map(p => {
        const name = p.split("/").pop() ?? p;
        return { id: crypto.randomUUID(), name, size: "—", type: detectType(name), path: p };
      });
      const updated = multiboot ? [...isos, ...next] : [next[0]];
      setIsos(updated);
      onIsoSelect?.(updated.map(i => i.path));
    }
  };

  // Web fallback
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const next: ISOFile[] = files.map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: formatSize(f.size),
      type: detectType(f.name),
      path: f.name,
    }));
    const updated = multiboot ? [...isos, ...next] : next.slice(0, 1);
    setIsos(updated);
    onIsoSelect?.(updated.map(i => i.path));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeISO = (id: string) => {
    const updated = isos.filter(i => i.id !== id);
    setIsos(updated);
    onIsoSelect?.(updated.map(i => i.path));
  };

  return (
    <SectionPanel title={t.iso_title} icon={<Disc className="h-4 w-4" />} glowing>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={multiboot} onCheckedChange={setMultiboot} />
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider cursor-pointer">
              {t.iso_multiboot}
            </Label>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{isos.length} {t.iso_loaded}</span>
        </div>

        <div className="space-y-2 min-h-[60px]">
          <AnimatePresence>
            {isos.map(iso => (
              <motion.div
                key={iso.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 p-2.5 rounded-md bg-secondary/50 border border-border group hover:border-primary/30 transition-colors"
              >
                {multiboot && <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />}
                <Disc className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground truncate">{iso.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{iso.size} · {iso.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  onClick={() => removeISO(iso.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>

          {isos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-5 rounded-md border border-dashed border-border bg-secondary/20">
              <Disc className="h-5 w-5 text-muted-foreground/60 mb-1.5" />
              <p className="text-xs font-mono text-muted-foreground">{t.iso_none}</p>
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept=".iso,.img,.efi,.bin" multiple={multiboot} onChange={onFiles} className="hidden" />
        <Button
          variant="outline"
          onClick={openNative}
          className="w-full border-dashed border-border hover:border-primary hover:text-primary font-mono text-xs"
        >
          <FolderOpen className="h-3.5 w-3.5 mr-2" />
          {multiboot ? t.iso_add : t.iso_browse}
        </Button>
      </div>
    </SectionPanel>
  );
}
