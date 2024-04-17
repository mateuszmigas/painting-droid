use crate::safe_storage::SafeStorage;
use reqwest;

#[derive(serde::Serialize)]
pub struct ApiResponse {
    status: u16,
    data: String,
}

#[tauri::command]
pub async fn send_request(url: String, body: String) -> Result<ApiResponse, String> {
    let client = reqwest::Client::new();
    let response = client.post(url).body(body).send().await;

    match response {
        Ok(response_ok) => Ok(ApiResponse {
            status: response_ok.status().as_u16(),
            data: if response_ok.status().is_success() {
                response_ok
                    .text()
                    .await
                    .unwrap_or_else(|_| String::from("Failed to get response text"))
            } else {
                String::from("")
            },
        }),
        Err(e) => Err(e.to_string()),
    }
}

fn get_storage(key: &String) -> Result<SafeStorage, String> {
    match SafeStorage::new(key) {
        Ok(storage) => Ok(storage),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn safe_storage_set(key: String, value: String) -> Result<(), String> {
    let storage = get_storage(&key)?;

    match storage.set_password(&value) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn safe_storage_has(key: String) -> Result<bool, String> {
    let storage = get_storage(&key)?;

    match storage.has_password() {
        Ok(has_password) => Ok(has_password),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn safe_storage_remove(key: String) -> Result<(), String> {
    let storage = get_storage(&key)?;

    match storage.delete_password() {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
