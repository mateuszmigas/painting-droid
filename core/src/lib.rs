use wasm_bindgen::prelude::*;
extern crate web_sys;
type WasmResult<T> = std::result::Result<T, String>;

macro_rules! _log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn grayscale(data: Vec<u8>) -> WasmResult<Vec<u8>> {
    let mut result = Vec::new();
    for i in 0..data.len() / 4 {
        let r = data[i * 4] as f32;
        let g = data[i * 4 + 1] as f32;
        let b = data[i * 4 + 2] as f32;
        let gray = (0.3 * r + 0.59 * g + 0.11 * b) as u8;
        result.push(gray);
        result.push(gray);
        result.push(gray);
        result.push(255);
    }
    Ok(result)
}

#[wasm_bindgen]
pub fn sepia(data: Vec<u8>) -> WasmResult<Vec<u8>> {
    let mut result = Vec::new();
    for i in 0..data.len() / 4 {
        let r = data[i * 4] as f32;
        let g = data[i * 4 + 1] as f32;
        let b = data[i * 4 + 2] as f32;

        // Apply the sepia transformation
        let new_r = (0.393 * r + 0.769 * g + 0.189 * b).min(255.0) as u8;
        let new_g = (0.349 * r + 0.686 * g + 0.168 * b).min(255.0) as u8;
        let new_b = (0.272 * r + 0.534 * g + 0.131 * b).min(255.0) as u8;

        // Append the new colors to the result vector
        result.push(new_r);
        result.push(new_g);
        result.push(new_b);
        result.push(255); // Alpha value, kept at 255 for full opacity
    }
    Ok(result)
}
