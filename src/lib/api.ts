/**
 * Tauri IPC bridge — wraps invoke() calls with graceful web fallbacks.
 * In browser dev mode (no Tauri), returns mock data so the UI still works.
 */

declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

const isTauri = () => typeof window !== "undefined" && !!window.__TAURI__;

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri()) {
    const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
    return tauriInvoke<T>(cmd, args);
  }
  // Browser mock — return sensible empty states
  throw new Error(`Tauri not available: ${cmd}`);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UsbDrive {
  name: string;
  path: string;
  size: string;
  size_bytes: number;
  bus: string;
  model: string;
  vendor: string;
  removable: boolean;
  mounted: boolean;
  mount_points: string[];
}

export interface SmartHealth {
  status: "healthy" | "warning" | "fail" | "unknown";
  temp_c: number | null;
  power_on_hours: number | null;
  reallocated_sectors: number | null;
  pending_sectors: number | null;
  uncorrectable: number | null;
  read_error_rate: number | null;
  overall: string;
}

export interface WriteProgress {
  percent: number;
  speed_mb: number;
  eta_secs: number;
  bytes_written: number;
  total_bytes: number;
  log_line: string;
}

export interface BenchmarkResult {
  read_mb: number;
  write_mb: number;
  device: string;
}

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exit_code: number;
}

export interface SystemInfo {
  hostname: string;
  kernel: string;
  arch: string;
  distro: string;
  udisks2: boolean;
  smartctl: boolean;
  dd: boolean;
  lsblk: boolean;
  b3sum: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  listUsbDrives: () => invoke<UsbDrive[]>("list_usb_drives"),

  unmountDevice: (device: string) =>
    invoke<CommandResult>("unmount_device", { device }),

  getSmartHealth: (device: string) =>
    invoke<SmartHealth>("get_smart_health", { device }),

  computeFileHash: (filePath: string, algorithm: string) =>
    invoke<string>("compute_file_hash", { filePath, algorithm }),

  startWriteIso: (params: {
    isoPath: string;
    device: string;
    writeMode: string;
    bufferMb: number;
    verifyAfter: boolean;
  }) =>
    invoke<void>("start_write_iso", {
      isoPath: params.isoPath,
      device: params.device,
      writeMode: params.writeMode,
      bufferMb: params.bufferMb,
      verifyAfter: params.verifyAfter,
    }),

  secureWipeDevice: (device: string, passes: number) =>
    invoke<CommandResult>("secure_wipe_device", { device, passes }),

  cloneDrive: (source: string, dest: string, bufferMb: number) =>
    invoke<CommandResult>("clone_drive", { source, dest, bufferMb }),

  backupToImage: (device: string, outputPath: string, compress: boolean) =>
    invoke<CommandResult>("backup_to_image", { device, outputPath, compress }),

  benchmarkDrive: (device: string) =>
    invoke<BenchmarkResult>("benchmark_drive", { device }),

  getSystemInfo: () => invoke<SystemInfo>("get_system_info"),

  installVentoy: (device: string, secureBoot: boolean) =>
    invoke<CommandResult>("install_ventoy", { device, secureBoot }),
};

// ─── Event listener helper ────────────────────────────────────────────────────

export async function listenEvent<T>(
  event: string,
  handler: (payload: T) => void
): Promise<() => void> {
  if (isTauri()) {
    const { listen } = await import("@tauri-apps/api/event");
    const unlisten = await listen<T>(event, (e) => handler(e.payload));
    return unlisten;
  }
  return () => {};
}

// ─── File dialog ──────────────────────────────────────────────────────────────

export async function openFileDialog(options: {
  title?: string;
  filters?: { name: string; extensions: string[] }[];
  multiple?: boolean;
}): Promise<string[] | null> {
  if (isTauri()) {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const result = await open({
      title: options.title,
      filters: options.filters,
      multiple: options.multiple ?? false,
    });
    if (!result) return null;
    if (Array.isArray(result)) return result as string[];
    return [result as string];
  }
  return null;
}

export async function saveFileDialog(options: {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
}): Promise<string | null> {
  if (isTauri()) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const result = await save({
      title: options.title,
      defaultPath: options.defaultPath,
      filters: options.filters,
    });
    return result as string | null;
  }
  return null;
}
