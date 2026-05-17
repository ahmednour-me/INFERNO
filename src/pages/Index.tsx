import { useState } from "react";
import { USBDriveSelector } from "@/components/USBDriveSelector";
import { ISOSelector } from "@/components/ISOSelector";
import { PartitionOptions } from "@/components/PartitionOptions";
import { AdvancedOptions } from "@/components/AdvancedOptions";
import { ProgressPanel } from "@/components/ProgressPanel";
import { PowerFeatures } from "@/components/PowerFeatures";
import { DriveHealth } from "@/components/DriveHealth";
import { HashVerifier } from "@/components/HashVerifier";
import { DriveTools } from "@/components/DriveTools";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SettingsPanel, SettingsTrigger } from "@/components/SettingsPanel";
import { SystemDeps } from "@/components/SystemDeps";
import { InfernoLogo } from "@/components/InfernoLogo";
import { useI18n } from "@/i18n";
import { UsbDrive } from "@/lib/api";
import { Cpu, Monitor, Usb, Flame, Layers, ShieldCheck, Wrench, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

type View = "forge" | "verify" | "tools" | "settings" | "about";

export default function Index() {
  const { t, lang } = useI18n();
  const [view, setView] = useState<View>("forge");
  const [selectedDrive, setSelectedDrive] = useState<UsbDrive | null>(null);
  const [selectedIsos, setSelectedIsos] = useState<string[]>([]);

  const nav: { id: View; label: string; icon: typeof Flame }[] = [
    { id: "forge",  label: t.nav_forge,   icon: Flame },
    { id: "verify", label: t.nav_verify,  icon: ShieldCheck },
    { id: "tools",  label: t.nav_tools,   icon: Wrench },
    { id: "about",  label: t.nav_about,   icon: Info },
  ];

  return (
    <div
      className="min-h-screen bg-background bg-grid flex"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Sidebar */}
      <aside className="w-16 border-r border-border bg-sidebar/80 backdrop-blur-sm flex flex-col items-center py-4 gap-2 sticky top-0 h-screen z-40">
        <InfernoLogo size={36} className="mb-3" />
        {nav.map(n => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center transition-all relative",
              view === n.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
            title={n.label}
          >
            <n.icon className="h-4 w-4" />
            {view === n.id && (
              <span className={cn(
                "absolute top-1/2 -translate-y-1/2 h-5 w-0.5 rounded bg-primary",
                lang === "ar" ? "right-0" : "left-0"
              )} />
            )}
          </button>
        ))}
        <div className="flex-1" />
        <SettingsTrigger onClick={() => setView("settings")} active={view === "settings"} lang={lang} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <InfernoLogo size={28} />
              <div>
                <h1 className="text-sm font-mono font-bold leading-none">
                  INFER<span className="text-primary">NO</span>
                </h1>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
                  {t.header_subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5"><Cpu className="h-3 w-3" /> x86_64</span>
                <span className="flex items-center gap-1.5"><Monitor className="h-3 w-3" /> Linux</span>
                <span className="flex items-center gap-1.5">
                  <Usb className="h-3 w-3" />
                  {selectedDrive ? `1 ${t.header_devices}` : `0 ${t.header_devices}`}
                </span>
              </div>
              <StatusIndicator status={selectedDrive ? "ready" : "idle"} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-6 py-5 max-w-[1400px] w-full mx-auto overflow-y-auto">
          <AnimatePresence mode="wait">

            {view === "forge" && (
              <motion.div key="forge" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <USBDriveSelector onSelect={setSelectedDrive} />
                  <ISOSelector onIsoSelect={setSelectedIsos} />
                  <DriveHealth device={selectedDrive?.path ?? null} />
                </div>
                <div className="space-y-4">
                  <PartitionOptions />
                  <AdvancedOptions />
                </div>
                <div className="space-y-4">
                  <PowerFeatures />
                  <ProgressPanel
                    device={selectedDrive?.path ?? null}
                    isoPath={selectedIsos[0] ?? null}
                  />
                </div>
              </motion.div>
            )}

            {view === "verify" && (
              <motion.div key="verify" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
                <HashVerifier />
                <DriveHealth device={selectedDrive?.path ?? null} />
              </motion.div>
            )}

            {view === "tools" && (
              <motion.div key="tools" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
                <DriveTools device={selectedDrive?.path ?? null} />
                <div className="space-y-4">
                  <PowerFeatures />
                </div>
              </motion.div>
            )}

            {view === "settings" && (
              <motion.div key="settings" {...fadeUp} className="max-w-5xl">
                <SettingsPanel />
              </motion.div>
            )}

            {view === "about" && (
              <motion.div key="about" {...fadeUp} className="max-w-2xl space-y-4">
                <div className="rounded-lg border border-border bg-card p-8 space-y-5">
                  <div className="flex items-center gap-5">
                    <InfernoLogo size={64} />
                    <div>
                      <h2 className="text-2xl font-mono font-bold leading-none">
                        INFER<span className="text-primary">NO</span>
                      </h2>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                        USB Forge v1.0.0
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {t.header_subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                    {t.about_description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Multi-boot ISO library",
                      "MBR / GPT / hybrid",
                      "BIOS · UEFI · Secure Boot",
                      "LUKS persistence",
                      "SHA-256 / 512 / BLAKE3",
                      "S.M.A.R.T. diagnostics",
                      "Drive cloning & backup",
                      "GRUB · syslinux · rEFInd",
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs font-mono text-foreground">
                        <Layers className="h-3 w-3 text-primary shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <SystemDeps />

                <div className="rounded-lg border border-border bg-card p-5 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                    {t.about_crafted}
                  </p>
                  <h3 className="text-base font-mono font-bold">Ahmed Nour</h3>
                  <p className="text-[11px] font-mono text-muted-foreground">ahmednour.vercel.app</p>
                  <p className="text-[10px] font-mono text-muted-foreground">GPL v3.0 License</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        <footer className="border-t border-border shrink-0">
          <div className="px-6 py-2.5 flex items-center justify-between">
            <p className="text-[10px] font-mono text-muted-foreground">INFERNO v1.0.0 — Forged for Linux</p>
            <p className="text-[10px] font-mono text-muted-foreground">GPL v3.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
