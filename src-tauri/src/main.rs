// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::{BufRead, BufReader};

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
            metadata.push('\n'); // Ensure newline separation
        }
    }

    Ok(metadata)
}

fn main() {
  tauri::Builder::default()
      .plugin(tauri_plugin_store::Builder::default().build())

        .invoke_handler(tauri::generate_handler![get_file_metadata])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
