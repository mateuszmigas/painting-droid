use reqwest;

#[derive(serde::Serialize)]
pub struct ApiResponse {
    status: u16,
    data: String,
}
#[tauri::command]
pub async fn send_request(url: String, body: String) -> Result<ApiResponse, String> {
    let client = reqwest::Client::new();
    let response = client.post(url)
        .body(body)
        .send()
        .await;

    match response {
        Ok(response_ok) => {
            Ok(ApiResponse{
                status: response_ok.status().as_u16(),
                data: if response_ok.status().is_success() {
                    response_ok.text().await.unwrap_or_else(|_| String::from("Failed to get response text"))
                } else {
                    String::from("")
                }
            })
        },
        Err(e) => Err(e.to_string()),
    }
}
