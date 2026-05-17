import { SectionPanel } from "./SectionPanel";
import { ShieldCheck, Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useState } from "react";
import { api, openFileDialog } from "@/lib/api";
import { useI18n } from "@/i18n";

type Result = "match" | "mismatch" | null;

const ALGOS = ["sha256", "sha512", "sha1", "md5", "blake3"];

export function HashVerifier() {
  const { t } = useI18n();
  const [expected, setExpected] = useState("");
  const [computed, setComputed] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [busy, setBusy] = useState(false);
  const [algo, setAlgo] = useState("sha256");
  const [filePath, setFilePath] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const computeHash = async (path: string) => {
    setBusy(true);
    setComputed("");
    setResult(null);
    try {
      const hash = await api.computeFileHash(path, algo);
      setComputed(hash);
      if (expected.trim()) {
        setResult(hash.toLowerCase() === expected.trim().toLowerCase() ? "match" : "mismatch");
      }
    } catch {
      // Fallback: Web Crypto API for browser
      try {
        const file = fileRef.current?.files?.[0];
        if (file) {
          const buf = await file.arrayBuffer();
          const digest = await crypto.subtle.digest("SHA-256", buf);
          const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
          setComputed(hex);
          if (expected.trim()) {
            setResult(hex.toLowerCase() === expected.trim().toLowerCase() ? "match" : "mismatch");
          }
        }
      } catch (e2) {
        setComputed("Error: " + String(e2));
      }
    } finally {
      setBusy(false);
    }
  };

  const openNative = async () => {
    const paths = await openFileDialog({ title: "Select file to hash" });
    if (paths?.[0]) {
      setFilePath(paths[0]);
      await computeHash(paths[0]);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilePath(file.name);
    await computeHash(file.name);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <SectionPanel title={t.verify_title} icon={<ShieldCheck className="h-4 w-4" />}>
      <div className="space-y-2.5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Algorithm
          </label>
          <Select value={algo} onValueChange={setAlgo}>
            <SelectTrigger className="bg-secondary border-border font-mono text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALGOS.map(a => (
                <SelectItem key={a} value={a} className="font-mono text-sm">{a.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            {t.verify_expected}
          </label>
          <Input
            value={expected}
            onChange={e => {
              setExpected(e.target.value);
              if (computed && e.target.value.trim()) {
                setResult(computed.toLowerCase() === e.target.value.trim().toLowerCase() ? "match" : "mismatch");
              }
            }}
            placeholder={t.verify_expected_ph}
            className="bg-secondary border-border font-mono text-xs h-9"
          />
        </div>

        <input ref={fileRef} type="file" onChange={onFile} className="hidden" />
        <Button
          variant="outline"
          onClick={openNative}
          disabled={busy}
          className="w-full border-border hover:border-primary hover:text-primary font-mono text-xs"
        >
          {busy ? <Upload className="h-3.5 w-3.5 mr-2 animate-pulse" /> : <FolderOpen className="h-3.5 w-3.5 mr-2" />}
          {busy ? t.verify_hashing : t.verify_compute}
        </Button>

        {filePath && !busy && (
          <p className="text-[10px] font-mono text-muted-foreground truncate">File: {filePath}</p>
        )}

        {computed && (
          <div className={`p-2 rounded-md border font-mono text-[10px] break-all ${
            result === "match" ? "border-success/40 bg-success/5 text-success" :
            result === "mismatch" ? "border-destructive/40 bg-destructive/5 text-destructive" :
            "border-border bg-secondary/40 text-foreground"
          }`}>
            {computed}
            {result && (
              <p className="mt-1 uppercase tracking-wider text-[9px]">
                {result === "match" ? t.verify_match : t.verify_mismatch}
              </p>
            )}
          </div>
        )}
      </div>
    </SectionPanel>
  );
}
