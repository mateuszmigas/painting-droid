use tauri_plugin_http::reqwest;

#[derive(serde::Serialize)]
pub struct ApiResponse {
    status: u16,
    data: String,
}
#[tauri::command]
pub async fn send_request(url: String, body: String) -> Result<ApiResponse, ()> {
    let client = reqwest::Client::new();
    let res = client.post(url)
        .body(body)
        .send()
        .await
        .unwrap();

    Ok(ApiResponse{
        status: res.status().as_u16(),
        data: if res.status().is_success() {
            res.text().await.unwrap_or_else(|_| String::from("Failed to get response text"))
        } else {
            String::from("")
        }
    })
}
