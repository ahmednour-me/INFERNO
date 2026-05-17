export type Lang = "en" | "ar";

export interface Translations {
  // Nav
  nav_forge: string;
  nav_verify: string;
  nav_tools: string;
  nav_about: string;
  nav_settings: string;

  // Header
  header_subtitle: string;
  header_devices: string;

  // USB Drive
  usb_title: string;
  usb_select: string;
  usb_no_devices: string;
  usb_no_devices_hint: string;
  usb_refresh: string;
  usb_device: string;
  usb_bus: string;
  usb_capacity: string;
  usb_warning: string;
  usb_mounted: string;

  // ISO
  iso_title: string;
  iso_multiboot: string;
  iso_loaded: string;
  iso_none: string;
  iso_browse: string;
  iso_add: string;

  // Partition
  part_title: string;
  part_scheme: string;
  part_target: string;
  part_filesystem: string;
  part_cluster: string;
  part_label: string;
  part_mbr: string;
  part_gpt: string;
  part_bios: string;
  part_uefi: string;
  part_both: string;

  // Advanced
  adv_title: string;
  adv_secureboot: string;
  adv_secureboot_desc: string;
  adv_badblocks: string;
  adv_badblocks_desc: string;
  adv_checksum: string;
  adv_checksum_desc: string;
  adv_persistence: string;
  adv_persistence_desc: string;
  adv_persist_size: string;

  // Power Features
  pwr_title: string;
  pwr_write_mode: string;
  pwr_bootloader: string;
  pwr_hash_algo: string;
  pwr_write_speed: string;
  pwr_luks: string;
  pwr_luks_desc: string;
  pwr_luks_pass: string;
  pwr_squashfs: string;
  pwr_squashfs_desc: string;
  pwr_erase_passes: string;
  pwr_erase_hint: string;
  pwr_speed_max: string;
  pwr_speed_balanced: string;
  pwr_speed_safe: string;

  // Progress / Operation
  op_title: string;
  op_start: string;
  op_abort: string;
  op_writing: string;
  op_progress: string;
  op_speed: string;
  op_eta: string;
  op_idle: string;

  // Verify
  verify_title: string;
  verify_expected: string;
  verify_expected_ph: string;
  verify_compute: string;
  verify_hashing: string;
  verify_match: string;
  verify_mismatch: string;

  // Drive Health
  health_title: string;
  health_run: string;
  health_running: string;
  health_no_device: string;
  health_temp: string;
  health_power_on: string;
  health_reads: string;
  health_writes: string;
  health_reallocated: string;
  health_pending: string;
  health_uncorrectable: string;

  // Tools
  tools_title: string;
  tools_wipe: string;
  tools_wipe_desc: string;
  tools_clone: string;
  tools_clone_desc: string;
  tools_backup: string;
  tools_backup_desc: string;
  tools_restore: string;
  tools_restore_desc: string;
  tools_benchmark: string;
  tools_benchmark_desc: string;
  tools_ventoy: string;
  tools_ventoy_desc: string;

  // Settings
  settings_title: string;
  settings_appearance: string;
  settings_accent: string;
  settings_language: string;
  settings_notifications: string;
  settings_notif_desc: string;
  settings_sounds: string;
  settings_sounds_desc: string;
  settings_safety: string;
  settings_confirm: string;
  settings_confirm_desc: string;
  settings_verify_after: string;
  settings_verify_desc: string;
  settings_autoeject: string;
  settings_autoeject_desc: string;
  settings_performance: string;
  settings_hw_accel: string;
  settings_hw_accel_desc: string;
  settings_parallel: string;
  settings_buffer: string;
  settings_advanced: string;
  settings_telemetry: string;
  settings_telemetry_desc: string;
  settings_devmode: string;
  settings_devmode_desc: string;
  settings_stored: string;
  settings_saved: string;
  settings_unsaved: string;
  settings_save: string;
  settings_reset: string;

  // About
  about_description: string;
  about_crafted: string;
  about_features: string;

  // Status
  status_idle: string;
  status_ready: string;
  status_busy: string;
  status_error: string;

  // Themes
  theme_inferno: string;
  theme_midnight: string;
  theme_matrix: string;
  theme_amber: string;

  // System
  sys_title: string;
  sys_dependencies: string;
  sys_installed: string;
  sys_missing: string;
}

export const en: Translations = {
  nav_forge: "Forge",
  nav_verify: "Verify",
  nav_tools: "Tools",
  nav_about: "About",
  nav_settings: "Settings",

  header_subtitle: "Bootable USB Forge",
  header_devices: "devices",

  usb_title: "USB Device",
  usb_select: "Select USB drive...",
  usb_no_devices: "No removable devices detected",
  usb_no_devices_hint: "Plug in a USB device and press refresh",
  usb_refresh: "Refresh",
  usb_device: "Device",
  usb_bus: "Bus",
  usb_capacity: "Capacity",
  usb_warning: "All data on this device will be destroyed",
  usb_mounted: "Device is mounted — will be unmounted before writing",

  iso_title: "ISO Image",
  iso_multiboot: "Multi-Boot Mode",
  iso_loaded: "loaded",
  iso_none: "No image selected",
  iso_browse: "Browse image file",
  iso_add: "Add ISO / IMG files",

  part_title: "Partition & Format",
  part_scheme: "Partition Scheme",
  part_target: "Target System",
  part_filesystem: "File System",
  part_cluster: "Cluster Size",
  part_label: "Volume Label",
  part_mbr: "MBR",
  part_gpt: "GPT",
  part_bios: "BIOS (CSM)",
  part_uefi: "UEFI",
  part_both: "BIOS + UEFI",

  adv_title: "Advanced",
  adv_secureboot: "Secure Boot",
  adv_secureboot_desc: "UEFI Secure Boot support",
  adv_badblocks: "Bad Blocks Check",
  adv_badblocks_desc: "Scan for bad sectors (slow)",
  adv_checksum: "Verify Checksum",
  adv_checksum_desc: "SHA-256 integrity check",
  adv_persistence: "Persistent Storage",
  adv_persistence_desc: "Keep data across reboots",
  adv_persist_size: "Size",

  pwr_title: "Power Features",
  pwr_write_mode: "Write Mode",
  pwr_bootloader: "Bootloader",
  pwr_hash_algo: "Hash Algorithm",
  pwr_write_speed: "Write Speed",
  pwr_luks: "LUKS Encryption",
  pwr_luks_desc: "Encrypt persistence partition",
  pwr_luks_pass: "Encryption passphrase (min 12 chars)",
  pwr_squashfs: "SquashFS Compression",
  pwr_squashfs_desc: "Save space on multi-boot drives",
  pwr_erase_passes: "Secure Erase Passes",
  pwr_erase_hint: "0 = quick format, 7 = paranoid (slow)",
  pwr_speed_max: "Maximum",
  pwr_speed_balanced: "Balanced",
  pwr_speed_safe: "Safe (verify each block)",

  op_title: "Operation",
  op_start: "Start",
  op_abort: "Abort",
  op_writing: "Writing...",
  op_progress: "Progress",
  op_speed: "Speed",
  op_eta: "ETA",
  op_idle: "Idle — waiting for operation",

  verify_title: "Hash Verification",
  verify_expected: "Expected SHA-256",
  verify_expected_ph: "Paste expected checksum...",
  verify_compute: "Compute file hash",
  verify_hashing: "Hashing...",
  verify_match: "✓ Hash matches",
  verify_mismatch: "✗ Hash mismatch",

  health_title: "Drive Diagnostics",
  health_run: "Run Health Check",
  health_running: "Reading S.M.A.R.T...",
  health_no_device: "Select a device and run a health check",
  health_temp: "Temp",
  health_power_on: "Power-on",
  health_reads: "Reads",
  health_writes: "Writes",
  health_reallocated: "Reallocated",
  health_pending: "Pending",
  health_uncorrectable: "Uncorrectable",

  tools_title: "Drive Tools",
  tools_wipe: "Secure Wipe",
  tools_wipe_desc: "Zero-fill or DoD 5220.22-M",
  tools_clone: "Clone Drive",
  tools_clone_desc: "Block-level duplicate",
  tools_backup: "Backup Image",
  tools_backup_desc: "Save USB → .img file",
  tools_restore: "Restore Image",
  tools_restore_desc: "Flash .img back to USB",
  tools_benchmark: "Speed Benchmark",
  tools_benchmark_desc: "Sequential read / write",
  tools_ventoy: "Install Ventoy",
  tools_ventoy_desc: "Multi-boot framework",

  settings_title: "Settings",
  settings_appearance: "Appearance",
  settings_accent: "Accent Theme",
  settings_language: "Language & Region",
  settings_notifications: "Desktop notifications",
  settings_notif_desc: "Show alerts when operations finish",
  settings_sounds: "Sound effects",
  settings_sounds_desc: "Play audio cues for completion and errors",
  settings_safety: "Safety",
  settings_confirm: "Confirm destructive operations",
  settings_confirm_desc: "Ask before formatting or wiping a drive",
  settings_verify_after: "Verify after write",
  settings_verify_desc: "Re-read the device and compare against source",
  settings_autoeject: "Auto-eject on completion",
  settings_autoeject_desc: "Safely unmount the drive when finished",
  settings_performance: "Performance",
  settings_hw_accel: "Hardware acceleration",
  settings_hw_accel_desc: "Use GPU for hashing and compression",
  settings_parallel: "Parallel I/O threads",
  settings_buffer: "Write buffer",
  settings_advanced: "Advanced",
  settings_telemetry: "Anonymous telemetry",
  settings_telemetry_desc: "Send crash reports only — no device data",
  settings_devmode: "Developer mode",
  settings_devmode_desc: "Expose raw block-device commands and logs",
  settings_stored: "Settings stored locally —",
  settings_saved: "saved ✓",
  settings_unsaved: "unsaved",
  settings_save: "Save changes",
  settings_reset: "Reset",

  about_description:
    "A native Linux desktop tool that fuses the speed of single-image flashing with the convenience of multi-boot USB management. Built for sysadmins, distro hoppers, and security professionals.",
  about_crafted: "Crafted by",
  about_features: "Features",

  status_idle: "IDLE",
  status_ready: "READY",
  status_busy: "BUSY",
  status_error: "ERROR",

  theme_inferno: "Inferno Cyan",
  theme_midnight: "Midnight Violet",
  theme_matrix: "Matrix Green",
  theme_amber: "Amber Forge",

  sys_title: "System",
  sys_dependencies: "Dependencies",
  sys_installed: "Installed",
  sys_missing: "Missing",
};

export const ar: Translations = {
  nav_forge: "الصياغة",
  nav_verify: "التحقق",
  nav_tools: "الأدوات",
  nav_about: "حول",
  nav_settings: "الإعدادات",

  header_subtitle: "صانع USB قابل للإقلاع",
  header_devices: "أجهزة",

  usb_title: "جهاز USB",
  usb_select: "اختر محرك USB...",
  usb_no_devices: "لا توجد أجهزة قابلة للإزالة",
  usb_no_devices_hint: "أدخل جهاز USB واضغط تحديث",
  usb_refresh: "تحديث",
  usb_device: "الجهاز",
  usb_bus: "الناقل",
  usb_capacity: "السعة",
  usb_warning: "سيتم مسح جميع البيانات على هذا الجهاز",
  usb_mounted: "الجهاز مُركَّب — سيُفك تركيبه قبل الكتابة",

  iso_title: "ملف ISO",
  iso_multiboot: "وضع الإقلاع المتعدد",
  iso_loaded: "محمّل",
  iso_none: "لم يتم اختيار صورة",
  iso_browse: "تصفح ملف الصورة",
  iso_add: "أضف ملفات ISO / IMG",

  part_title: "القسم والتنسيق",
  part_scheme: "مخطط التقسيم",
  part_target: "النظام المستهدف",
  part_filesystem: "نظام الملفات",
  part_cluster: "حجم الكتلة",
  part_label: "اسم المجلد",
  part_mbr: "MBR",
  part_gpt: "GPT",
  part_bios: "BIOS (CSM)",
  part_uefi: "UEFI",
  part_both: "BIOS + UEFI",

  adv_title: "خيارات متقدمة",
  adv_secureboot: "الإقلاع الآمن",
  adv_secureboot_desc: "دعم Secure Boot لـ UEFI",
  adv_badblocks: "فحص القطاعات التالفة",
  adv_badblocks_desc: "مسح القطاعات التالفة (بطيء)",
  adv_checksum: "التحقق من المجموع",
  adv_checksum_desc: "فحص سلامة SHA-256",
  adv_persistence: "التخزين الدائم",
  adv_persistence_desc: "الاحتفاظ بالبيانات عبر إعادة التشغيل",
  adv_persist_size: "الحجم",

  pwr_title: "الميزات المتقدمة",
  pwr_write_mode: "وضع الكتابة",
  pwr_bootloader: "محمّل الإقلاع",
  pwr_hash_algo: "خوارزمية الهاش",
  pwr_write_speed: "سرعة الكتابة",
  pwr_luks: "تشفير LUKS",
  pwr_luks_desc: "تشفير قسم التخزين الدائم",
  pwr_luks_pass: "عبارة التشفير (12 حرفًا على الأقل)",
  pwr_squashfs: "ضغط SquashFS",
  pwr_squashfs_desc: "توفير مساحة على أقراص الإقلاع المتعدد",
  pwr_erase_passes: "تمريرات المسح الآمن",
  pwr_erase_hint: "0 = تنسيق سريع، 7 = مسح شامل (بطيء)",
  pwr_speed_max: "أقصى سرعة",
  pwr_speed_balanced: "متوازن",
  pwr_speed_safe: "آمن (التحقق من كل كتلة)",

  op_title: "العملية",
  op_start: "بدء",
  op_abort: "إلغاء",
  op_writing: "جارٍ الكتابة...",
  op_progress: "التقدم",
  op_speed: "السرعة",
  op_eta: "الوقت المتبقي",
  op_idle: "في الانتظار",

  verify_title: "التحقق من الهاش",
  verify_expected: "SHA-256 المتوقع",
  verify_expected_ph: "الصق المجموع المتوقع...",
  verify_compute: "احسب هاش الملف",
  verify_hashing: "جارٍ الحساب...",
  verify_match: "✓ الهاش متطابق",
  verify_mismatch: "✗ الهاش غير متطابق",

  health_title: "تشخيص القرص",
  health_run: "تشغيل فحص الصحة",
  health_running: "قراءة بيانات S.M.A.R.T...",
  health_no_device: "اختر جهازًا وشغّل الفحص",
  health_temp: "الحرارة",
  health_power_on: "ساعات التشغيل",
  health_reads: "القراءات",
  health_writes: "الكتابات",
  health_reallocated: "القطاعات المعاد تخصيصها",
  health_pending: "في الانتظار",
  health_uncorrectable: "غير قابل للتصحيح",

  tools_title: "أدوات القرص",
  tools_wipe: "مسح آمن",
  tools_wipe_desc: "ملء بالأصفار أو DoD 5220.22-M",
  tools_clone: "استنساخ القرص",
  tools_clone_desc: "نسخ على مستوى الكتل",
  tools_backup: "نسخ احتياطي",
  tools_backup_desc: "حفظ USB كملف .img",
  tools_restore: "استعادة صورة",
  tools_restore_desc: "كتابة .img على USB",
  tools_benchmark: "قياس السرعة",
  tools_benchmark_desc: "اختبار القراءة والكتابة التسلسلية",
  tools_ventoy: "تثبيت Ventoy",
  tools_ventoy_desc: "إطار الإقلاع المتعدد",

  settings_title: "الإعدادات",
  settings_appearance: "المظهر",
  settings_accent: "لون النظام",
  settings_language: "اللغة والمنطقة",
  settings_notifications: "إشعارات سطح المكتب",
  settings_notif_desc: "إظهار تنبيهات عند اكتمال العمليات",
  settings_sounds: "المؤثرات الصوتية",
  settings_sounds_desc: "تشغيل أصوات عند الاكتمال والأخطاء",
  settings_safety: "الأمان",
  settings_confirm: "تأكيد العمليات المدمرة",
  settings_confirm_desc: "السؤال قبل تنسيق القرص أو مسحه",
  settings_verify_after: "التحقق بعد الكتابة",
  settings_verify_desc: "إعادة قراءة الجهاز ومقارنته بالمصدر",
  settings_autoeject: "الإخراج التلقائي عند الاكتمال",
  settings_autoeject_desc: "إلغاء تركيب القرص بأمان عند الانتهاء",
  settings_performance: "الأداء",
  settings_hw_accel: "تسريع المعالج الرسومي",
  settings_hw_accel_desc: "استخدام GPU للتجزئة والضغط",
  settings_parallel: "خيوط الإدخال/الإخراج المتوازية",
  settings_buffer: "مخزن الكتابة",
  settings_advanced: "متقدم",
  settings_telemetry: "قياس عن بُعد مجهول",
  settings_telemetry_desc: "إرسال تقارير الأعطال فقط — بدون بيانات الجهاز",
  settings_devmode: "وضع المطور",
  settings_devmode_desc: "كشف أوامر الجهاز الأولية والسجلات",
  settings_stored: "الإعدادات محفوظة محليًا —",
  settings_saved: "تم الحفظ ✓",
  settings_unsaved: "غير محفوظ",
  settings_save: "حفظ التغييرات",
  settings_reset: "إعادة ضبط",

  about_description:
    "أداة سطح مكتب لينكس أصيلة تجمع بين سرعة كتابة الصور الفردية وسهولة إدارة USB متعدد الإقلاع. مصممة لمسؤولي الأنظمة ومحبي التوزيعات والمتخصصين في الأمن.",
  about_crafted: "صمّمها",
  about_features: "المميزات",

  status_idle: "خامل",
  status_ready: "جاهز",
  status_busy: "مشغول",
  status_error: "خطأ",

  theme_inferno: "سماوي مشتعل",
  theme_midnight: "بنفسجي منتصف الليل",
  theme_matrix: "أخضر ماتريكس",
  theme_amber: "كهرماني",

  sys_title: "النظام",
  sys_dependencies: "التبعيات",
  sys_installed: "مثبّت",
  sys_missing: "مفقود",
};

export const translations: Record<Lang, Translations> = { en, ar };
