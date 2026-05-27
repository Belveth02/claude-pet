use std::process::Command;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

#[tauri::command]
fn launch_claude_code() -> Result<(), String> {
    // 在 C:\Users\Strelitzia 目录启动 PowerShell 运行 claude
    Command::new("cmd.exe")
        .args([
            "/c", "start", "powershell.exe", "-NoExit",
            "-Command", "Set-Location C:\\Users\\Strelitzia; claude"
        ])
        .spawn()
        .map_err(|e| format!("启动失败: {}", e))?;
    Ok(())
}

#[tauri::command]
fn launch_vscode() -> Result<(), String> {
    // 直接打开 VSCode 远程连接 WSL，然后 Ctrl+Shift+` 打开集成终端输 claude
    Command::new("code")
        .args(["--remote", "wsl+Ubuntu", "/home/strelitzia/Project"])
        .spawn()
        .map_err(|e| format!("启动失败: {}", e))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![launch_claude_code, launch_vscode])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // 透明置顶设置
            window.set_always_on_top(true)?;
            window.set_skip_taskbar(true)?;
            window.set_ignore_cursor_events(false)?;

            // 系统托盘
            let show = MenuItemBuilder::with_id("show", "显示桌宠").build(app)?;
            let hide = MenuItemBuilder::with_id("hide", "隐藏桌宠").build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "退出").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show)
                .item(&hide)
                .separator()
                .item(&quit)
                .build()?;

            // 托盘图标 (32x32 RGBA 纯橙色)
            let icon_pixels: Vec<u8> = (0..32 * 32)
                .flat_map(|_| [0xFEu8, 0x87, 0x2D, 0xFF])
                .collect();
            let tray_icon = tauri::image::Image::new(&icon_pixels, 32, 32);

            let _tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .menu(&menu)
                .tooltip("Claude Pet")
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "show" => {
                            if let Some(w) = app.get_webview_window("main") { let _ = w.show(); }
                        }
                        "hide" => {
                            if let Some(w) = app.get_webview_window("main") { let _ = w.hide(); }
                        }
                        "quit" => app.exit(0),
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = if w.is_visible().unwrap_or(false) {
                                w.hide()
                            } else {
                                w.show()
                            };
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("启动失败");
}
