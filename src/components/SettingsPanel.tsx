import { useEffect, useState } from "react";
import { SectionPanel } from "./SectionPanel";
import { Settings as SettingsIcon, Palette, Languages, Bell, Shield, Cpu, HardDrive, Terminal, Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { Lang } from "@/i18n/translations";

type Theme = "inferno" | "midnight" | "matrix" | "amber";

const THEMES: { id: Theme; label: string; hue: string; swatch: string }[] = [
  { id: "inferno",  label: "Inferno Cyan",     hue: "190 95% 50%", swatch: "#0ad4ff" },
  { id: "midnight", label: "Midnight Violet",  hue: "265 90% 65%", swatch: "#9b6bff" },
  { id: "matrix",   label: "Matrix Green",     hue: "142 76% 45%", swatch: "#22c55e" },
  { id: "amber",    label: "Amber Forge",      hue: "28 95% 55%",  swatch: "#f97316" },
];

const SETTINGS_KEY = "inferno.settings";

interface Settings {
  theme: Theme;
  notifications: boolean;
  sounds: boolean;
  confirmDestructive: boolean;
  autoEject: boolean;
  verifyAfterWrite: boolean;
  hardwareAccel: boolean;
  parallelIO: number;
  bufferMB: number;
  telemetry: boolean;
  devMode: boolean;
}

const DEFAULTS: Settings = {
  theme: "inferno",
  notifications: true,
  sounds: false,
  confirmDestructive: true,
  autoEject: true,
  verifyAfterWrite: true,
  hardwareAccel: true,
  parallelIO: 4,
  bufferMB: 32,
  telemetry: false,
  devMode: false,
};

function applyTheme(theme: Theme) {
  const t = THEMES.find(t => t.id === theme) ?? THEMES[0];
  const root = document.documentElement;
  root.style.setProperty("--primary", t.hue);
  root.style.setProperty("--accent", t.hue);
  root.style.setProperty("--ring", t.hue);
  root.style.setProperty("--sidebar-primary", t.hue);
  root.style.setProperty("--glow-primary", `0 0 20px hsl(${t.hue} / 0.35)`);
}

export function SettingsPanel() {
  const { t, lang, setLang } = useI18n();

  const [s, setS] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => { applyTheme(s.theme); }, [s.theme]);

  const update = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setS(prev => ({ ...prev, [k]: v }));

  const save = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const reset = () => {
    setS(DEFAULTS);
    localStorage.removeItem(SETTINGS_KEY);
    applyTheme(DEFAULTS.theme);
    setLang("en");
  };

  const Toggle = ({ label, desc, value, onChange }: {
    label: string; desc?: string; value: boolean; onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between gap-3 p-2.5 rounded-md hover:bg-secondary/40 transition text-left"
    >
      <div className="min-w-0">
        <p className="text-xs font-mono text-foreground">{label}</p>
        {desc && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <span className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors",
        value ? "bg-primary" : "bg-secondary border border-border"
      )}>
        <span className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform",
          value ? "translate-x-4" : "translate-x-0.5"
        )} />
      </span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Appearance */}
      <SectionPanel title={t.settings_appearance} icon={<Palette className="h-3.5 w-3.5" />}>
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t.settings_accent}</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => update("theme", theme.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md border text-left transition",
                  s.theme === theme.id ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/40"
                )}
              >
                <span className="h-4 w-4 rounded-full border border-border/60 shrink-0" style={{ background: theme.swatch }} />
                <span className="text-[11px] font-mono truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      </SectionPanel>

      {/* Language — THIS is the fixed one */}
      <SectionPanel title={t.settings_language} icon={<Languages className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 gap-2">
          {(["en", "ar"] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}   // ← uses context, actually changes language
              className={cn(
                "p-2.5 rounded-md border text-sm font-mono transition",
                lang === l ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary/40"
              )}
            >
              {l === "en" ? "🇬🇧  English" : "🇸🇦  العربية"}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] font-mono text-muted-foreground">
          {lang === "ar" ? "اللغة الحالية: العربية (RTL)" : "Current: English (LTR)"}
        </p>
      </SectionPanel>

      {/* Notifications */}
      <SectionPanel title={t.settings_notifications.split(" ")[0] + "s"} icon={<Bell className="h-3.5 w-3.5" />}>
        <div className="space-y-1">
          <Toggle label={t.settings_notifications} desc={t.settings_notif_desc} value={s.notifications} onChange={v => update("notifications", v)} />
          <Toggle label={t.settings_sounds} desc={t.settings_sounds_desc} value={s.sounds} onChange={v => update("sounds", v)} />
        </div>
      </SectionPanel>

      {/* Safety */}
      <SectionPanel title={t.settings_safety} icon={<Shield className="h-3.5 w-3.5" />}>
        <div className="space-y-1">
          <Toggle label={t.settings_confirm} desc={t.settings_confirm_desc} value={s.confirmDestructive} onChange={v => update("confirmDestructive", v)} />
          <Toggle label={t.settings_verify_after} desc={t.settings_verify_desc} value={s.verifyAfterWrite} onChange={v => update("verifyAfterWrite", v)} />
          <Toggle label={t.settings_autoeject} desc={t.settings_autoeject_desc} value={s.autoEject} onChange={v => update("autoEject", v)} />
        </div>
      </SectionPanel>

      {/* Performance */}
      <SectionPanel title={t.settings_performance} icon={<Cpu className="h-3.5 w-3.5" />}>
        <div className="space-y-3">
          <Toggle label={t.settings_hw_accel} desc={t.settings_hw_accel_desc} value={s.hardwareAccel} onChange={v => update("hardwareAccel", v)} />
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-muted-foreground">{t.settings_parallel}</span>
              <span className="text-primary">{s.parallelIO}</span>
            </div>
            <input type="range" min={1} max={16} value={s.parallelIO}
              onChange={e => update("parallelIO", Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-muted-foreground">{t.settings_buffer}</span>
              <span className="text-primary">{s.bufferMB} MB</span>
            </div>
            <input type="range" min={4} max={256} step={4} value={s.bufferMB}
              onChange={e => update("bufferMB", Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
        </div>
      </SectionPanel>

      {/* Advanced */}
      <SectionPanel title={t.settings_advanced} icon={<Terminal className="h-3.5 w-3.5" />}>
        <div className="space-y-1">
          <Toggle label={t.settings_telemetry} desc={t.settings_telemetry_desc} value={s.telemetry} onChange={v => update("telemetry", v)} />
          <Toggle label={t.settings_devmode} desc={t.settings_devmode_desc} value={s.devMode} onChange={v => update("devMode", v)} />
        </div>
      </SectionPanel>

      {/* Save / Reset */}
      <div className="md:col-span-2 flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{t.settings_stored}</span>
          <span className={cn("transition", saved ? "text-success" : "text-muted-foreground")}>
            {saved ? t.settings_saved : t.settings_unsaved}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-[11px] font-mono hover:bg-secondary/60">
            <RotateCcw className="h-3 w-3" /> {t.settings_reset}
          </button>
          <button onClick={save} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[11px] font-mono hover:opacity-90">
            <Save className="h-3 w-3" /> {t.settings_save}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsTrigger({ onClick, active, lang }: { onClick: () => void; active: boolean; lang?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-md flex items-center justify-center transition-all relative",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
      )}
      title="Settings"
    >
      <SettingsIcon className="h-4 w-4" />
      {active && <span className={lang === "ar" ? "absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-l bg-primary" : "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-primary"} />}
    </button>
  );
}
// Export updated SettingsTrigger with lang support
