use std::collections::HashMap;
use std::error::Error;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use crate::safe_storage::SafeStorage;
use reqwest;
use regex::Regex;

#[derive(serde::Serialize)]
pub struct ApiResponse {
    status: u16,
    data: String,
}

fn convert_hashmap_to_headermap(headers: HashMap<String, String>) -> Result<HeaderMap, Box<dyn Error>> {
    let mut header_map = HeaderMap::new();
    let re = Regex::new(r"APIKEY\((.*?)\)")?;

    for (key, value) in headers {
        let modified_value = re.replace_all(&value, |caps: &regex::Captures| {
            let model_id = &caps[1].to_string();
            get_storage(model_id)
                .and_then(|storage| storage.get_password())
                .unwrap_or_else(|_| String::from("Api Key Not Found"))
        }).to_string();

        let header_name = HeaderName::from_bytes(key.as_bytes())?;
        let header_value = HeaderValue::from_str(&modified_value)?;
        header_map.insert(header_name, header_value);
    }

    Ok(header_map)
}

#[tauri::command]
pub async fn send_request(
    url: String,
    body: String,
    headers: HashMap<String, String>,
) -> Result<ApiResponse, String> {
    let client = reqwest::Client::new();
    let header_map = match convert_hashmap_to_headermap(headers) {
        Ok(map) => map,
        Err(e) => return Err(e.to_string()),
    };
    let response = client.post(url).body(body).headers(header_map).send().await;

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
pub async fn safe_storage_delete(key: String) -> Result<(), String> {
    let storage = get_storage(&key)?;

    match storage.delete_password() {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
