import { SectionPanel } from "./SectionPanel";
import { Wrench, ShieldCheck, HardDrive, Database, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useI18n } from "@/i18n";

export function AdvancedOptions() {
  const { t } = useI18n();
  const [secureBoot, setSecureBoot] = useState(true);
  const [badBlocks, setBadBlocks] = useState(false);
  const [persistence, setPersistence] = useState(false);
  const [persistSize, setPersistSize] = useState([4]);
  const [checksum, setChecksum] = useState(true);

  const Row = ({ icon, label, desc, checked, onChange, color = "text-foreground" }: {
    icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; color?: string;
  }) => (
    <div className="flex items-center justify-between p-2.5 rounded-md bg-secondary/30 border border-border">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <p className={`text-xs font-mono ${color}`}>{label}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <SectionPanel title={t.adv_title} icon={<Wrench className="h-4 w-4" />}>
      <div className="space-y-3">
        <Row icon={<ShieldCheck className="h-4 w-4 text-success" />} label={t.adv_secureboot} desc={t.adv_secureboot_desc} checked={secureBoot} onChange={setSecureBoot} />
        <Row icon={<HardDrive className="h-4 w-4 text-warning" />} label={t.adv_badblocks} desc={t.adv_badblocks_desc} checked={badBlocks} onChange={setBadBlocks} />
        <Row icon={<CheckCircle2 className="h-4 w-4 text-info" />} label={t.adv_checksum} desc={t.adv_checksum_desc} checked={checksum} onChange={setChecksum} />
        <div className="p-2.5 rounded-md bg-secondary/30 border border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-mono text-foreground">{t.adv_persistence}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{t.adv_persistence_desc}</p>
              </div>
            </div>
            <Switch checked={persistence} onCheckedChange={setPersistence} />
          </div>
          {persistence && (
            <div className="space-y-1.5 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.adv_persist_size}</span>
                <span className="text-xs font-mono text-primary">{persistSize[0]} GB</span>
              </div>
              <Slider value={persistSize} onValueChange={setPersistSize} min={1} max={16} step={1} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </SectionPanel>
  );
}
