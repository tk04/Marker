// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::fs::metadata;
use std::time::SystemTime;
use tauri::{Manager, Window};
use tauri_plugin_context_menu;
mod menu;

#[derive(Serialize, Deserialize, Debug)]
pub struct FileMeta {
    pub created_at: Option<SystemTime>,
    pub updated_at: Option<SystemTime>,
}

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
fn get_file_metadata(filepath: String) -> FileMeta {
    if let Ok(meta) = metadata(filepath) {
        return FileMeta {
            updated_at: meta.modified().ok(),
            created_at: meta.created().ok(),
        };
    }
    FileMeta {
        created_at: None,
        updated_at: None,
    }
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                let win = app.get_window("main").unwrap();
                win.set_transparent_titlebar();
            }
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_context_menu::init())
        .invoke_handler(tauri::generate_handler![get_file_metadata])
        .menu(menu::os_default(&context.package_info().name))
        .run(context)
        .expect("error while running tauri application");
}
