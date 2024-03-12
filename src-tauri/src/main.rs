// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::io::{BufRead, BufReader};
use tauri::{Manager, Window};

pub enum ToolbarThickness {
    Thick,
    Medium,
    Thin,
}
pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self);
}
#[cfg(target_os = "macos")]
impl WindowExt for Window {
    fn set_transparent_titlebar(&self) {
        use cocoa::appkit::{NSWindow, NSWindowTitleVisibility};
        use objc::{class, msg_send, sel, sel_impl};

        unsafe {
            let id = self.ns_window().unwrap() as cocoa::base::id;

            id.setTitlebarAppearsTransparent_(cocoa::base::YES);
            let thickness = ToolbarThickness::Medium;
            match thickness {
                ToolbarThickness::Thick => {
                    self.set_title("").ok();
                    id.setToolbar_(msg_send![class!(NSToolbar), new]);
                }
                ToolbarThickness::Medium => {
                    id.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
                    id.setToolbar_(msg_send![class!(NSToolbar), new]);
                }
                ToolbarThickness::Thin => {
                    id.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
                }
            }
        }
    }
}
#[tauri::command]
fn get_file_metadata(file_path: String) -> Result<String, String> {
    let file = match File::open(&file_path) {
        Ok(file) => file,
        Err(err) => return Err(format!("Error opening file: {}", err)),
    };
    let mut metadata = String::new();
    let mut metadata_started = false;

    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = match line {
            Ok(line) => line,
            Err(err) => return Err(format!("Error reading line: {}", err)),
        };

        if !metadata_started && line.trim() == "---" {
            metadata_started = true;
            continue;
        }

        if metadata_started && line.trim() == "---" {
            break;
        }

        if metadata_started {
            metadata.push_str(&line);
            metadata.push('\n');
        }
    }

    Ok(metadata)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(target_os = "macos") {
                let win = app.get_window("main").unwrap();
                win.set_transparent_titlebar();
            }
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_file_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
