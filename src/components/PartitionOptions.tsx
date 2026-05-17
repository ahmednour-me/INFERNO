import { SectionPanel } from "./SectionPanel";
import { Settings2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/i18n";

export function PartitionOptions() {
  const { t } = useI18n();
  const [partScheme, setPartScheme] = useState("gpt");
  const [targetSys, setTargetSys] = useState("uefi");
  const [fileSystem, setFileSystem] = useState("fat32");
  const [clusterSize, setClusterSize] = useState("default");

  return (
    <SectionPanel title={t.part_title} icon={<Settings2 className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.part_scheme}</label>
          <Select value={partScheme} onValueChange={setPartScheme}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mbr" className="font-mono text-sm">{t.part_mbr}</SelectItem>
              <SelectItem value="gpt" className="font-mono text-sm">{t.part_gpt}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.part_target}</label>
          <Select value={targetSys} onValueChange={setTargetSys}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bios" className="font-mono text-sm">{t.part_bios}</SelectItem>
              <SelectItem value="uefi" className="font-mono text-sm">{t.part_uefi}</SelectItem>
              <SelectItem value="both" className="font-mono text-sm">{t.part_both}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.part_filesystem}</label>
          <Select value={fileSystem} onValueChange={setFileSystem}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["fat32","ntfs","exfat","ext4"].map(fs => (
                <SelectItem key={fs} value={fs} className="font-mono text-sm">{fs.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.part_cluster}</label>
          <Select value={clusterSize} onValueChange={setClusterSize}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="font-mono text-sm">Default</SelectItem>
              {["4096","8192","16384","32768"].map(s => (
                <SelectItem key={s} value={s} className="font-mono text-sm">{parseInt(s) >= 1024 ? (parseInt(s)/1024)+"KB" : s+" B"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.part_label}</label>
          <Input defaultValue="BOOTABLE_USB" className="bg-secondary border-border font-mono text-sm h-9" />
        </div>
      </div>
    </SectionPanel>
  );
}
