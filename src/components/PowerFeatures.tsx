import { SectionPanel } from "./SectionPanel";
import { Lock, FileSearch, Gauge, Layers, Workflow, KeyRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/i18n";

export function PowerFeatures() {
  const { t } = useI18n();
  const [encryption, setEncryption] = useState(false);
  const [compression, setCompression] = useState(false);
  const [writeMode, setWriteMode] = useState("iso");
  const [bootloader, setBootloader] = useState("grub2");
  const [hashAlgo, setHashAlgo] = useState("sha256");
  const [wipePasses, setWipePasses] = useState([1]);
  const [writeSpeed, setWriteSpeed] = useState("max");

  return (
    <SectionPanel title={t.pwr_title} icon={<Workflow className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3 w-3" /> {t.pwr_write_mode}
          </label>
          <Select value={writeMode} onValueChange={setWriteMode}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="iso" className="font-mono text-sm">ISO Mode (recommended)</SelectItem>
              <SelectItem value="dd" className="font-mono text-sm">DD Image Mode</SelectItem>
              <SelectItem value="ventoy" className="font-mono text-sm">Ventoy Multi-Boot</SelectItem>
              <SelectItem value="hybrid" className="font-mono text-sm">Hybrid (ISO + Ventoy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="h-3 w-3" /> {t.pwr_bootloader}
          </label>
          <Select value={bootloader} onValueChange={setBootloader}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["grub2","syslinux","isolinux","refind","systemd"].map(b => (
                <SelectItem key={b} value={b} className="font-mono text-sm">{b === "systemd" ? "systemd-boot" : b.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileSearch className="h-3 w-3" /> {t.pwr_hash_algo}
          </label>
          <Select value={hashAlgo} onValueChange={setHashAlgo}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["md5","sha1","sha256","sha512","blake3"].map(a => (
                <SelectItem key={a} value={a} className="font-mono text-sm">{a.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="h-3 w-3" /> {t.pwr_write_speed}
          </label>
          <Select value={writeSpeed} onValueChange={setWriteSpeed}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="max" className="font-mono text-sm">{t.pwr_speed_max}</SelectItem>
              <SelectItem value="balanced" className="font-mono text-sm">{t.pwr_speed_balanced}</SelectItem>
              <SelectItem value="safe" className="font-mono text-sm">{t.pwr_speed_safe}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-md bg-secondary/30 border border-border">
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-mono text-foreground">{t.pwr_luks}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{t.pwr_luks_desc}</p>
              </div>
            </div>
            <Switch checked={encryption} onCheckedChange={setEncryption} />
          </div>
          {encryption && (
            <Input type="password" placeholder={t.pwr_luks_pass} className="bg-secondary border-border font-mono text-sm h-9" />
          )}
        </div>
        <div className="col-span-2 flex items-center justify-between p-2.5 rounded-md bg-secondary/30 border border-border">
          <div className="flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-info" />
            <div>
              <p className="text-xs font-mono text-foreground">{t.pwr_squashfs}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{t.pwr_squashfs_desc}</p>
            </div>
          </div>
          <Switch checked={compression} onCheckedChange={setCompression} />
        </div>
        <div className="col-span-2 p-2.5 rounded-md bg-secondary/30 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-foreground">{t.pwr_erase_passes}</span>
            <span className="text-xs font-mono text-primary">{wipePasses[0]}× DoD</span>
          </div>
          <Slider value={wipePasses} onValueChange={setWipePasses} min={0} max={7} step={1} />
          <p className="text-[10px] font-mono text-muted-foreground">{t.pwr_erase_hint}</p>
        </div>
      </div>
    </SectionPanel>
  );
}
