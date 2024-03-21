#[tauri::command]
pub fn open_file(extension: &str) -> String {
    format!("Hello, {}! You've been greeted from !", extension)
}
