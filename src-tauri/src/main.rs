#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Emitter;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UsbDrive { pub name: String, pub path: String, pub size: String, pub size_bytes: u64, pub bus: String, pub model: String, pub vendor: String, pub removable: bool, pub mounted: bool, pub mount_points: Vec<String> }
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SmartHealth { pub status: String, pub temp_c: Option<i32>, pub power_on_hours: Option<u64>, pub reallocated_sectors: Option<u64>, pub pending_sectors: Option<u64>, pub uncorrectable: Option<u64>, pub read_error_rate: Option<u64>, pub overall: String }
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WriteProgress { pub percent: f64, pub speed_mb: f64, pub eta_secs: u64, pub bytes_written: u64, pub total_bytes: u64, pub log_line: String }
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BenchmarkResult { pub read_mb: f64, pub write_mb: f64, pub device: String }
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommandResult { pub success: bool, pub stdout: String, pub stderr: String, pub exit_code: i32 }

#[tauri::command]
async fn list_usb_drives() -> Result<Vec<UsbDrive>, String> { Ok(vec![]) }
#[tauri::command]
async fn unmount_device(_device: String) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }
#[tauri::command]
async fn get_smart_health(_device: String) -> Result<SmartHealth, String> { Ok(SmartHealth { status: "healthy".into(), temp_c: None, power_on_hours: None, reallocated_sectors: None, pending_sectors: None, uncorrectable: None, read_error_rate: None, overall: "".into() }) }
#[tauri::command]
async fn compute_file_hash(_file_path: String, _algorithm: String) -> Result<String, String> { Ok("".into()) }
#[tauri::command]
async fn start_write_iso(_app: tauri::AppHandle, _iso_path: String, _device: String, _write_mode: String) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }
#[tauri::command]
async fn secure_wipe_device(_app: tauri::AppHandle, _device: String) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }
#[tauri::command]
async fn clone_drive(_app: tauri::AppHandle, _source: String, _target: String) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }
#[tauri::command]
async fn backup_to_image(_app: tauri::AppHandle, _source: String, _image_path: String) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }
#[tauri::command]
async fn benchmark_drive(_device: String) -> Result<BenchmarkResult, String> { Ok(BenchmarkResult { read_mb: 0.0, write_mb: 0.0, device: "".into() }) }
#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo { pub hostname: String, pub kernel: String, pub arch: String, pub distro: String, pub udisks2: bool, pub smartctl: bool, pub dd: bool, pub lsblk: bool, pub b3sum: bool }
#[tauri::command]
async fn get_system_info() -> Result<SystemInfo, String> { Ok(SystemInfo { hostname: "".into(), kernel: "".into(), arch: "".into(), distro: "".into(), udisks2: true, smartctl: true, dd: true, lsblk: true, b3sum: true }) }
#[tauri::command]
async fn install_ventoy(_app: tauri::AppHandle, _device: String, _secure_boot: bool) -> Result<CommandResult, String> { Ok(CommandResult { success: true, stdout: "".into(), stderr: "".into(), exit_code: 0 }) }

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            list_usb_drives, unmount_device, get_smart_health, compute_file_hash, start_write_iso,
            secure_wipe_device, clone_drive, backup_to_image, benchmark_drive, get_system_info, install_ventoy
        ])
        .run(tauri::generate_context!())
        .expect("error while running INFERNO USB Forge");
}
