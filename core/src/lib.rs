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

#[wasm_bindgen]
pub fn flood_fill(
    mut data: Vec<u8>,
    width: u32,
    height: u32,
    start_x: u32,
    start_y: u32,
    fill_r: u8,
    fill_g: u8,
    fill_b: u8,
    fill_a: u8,
    tolerance: f32,
) -> WasmResult<Vec<u8>> {
    let mut visited = vec![false; (width * height) as usize];

    let get_color = |x: u32, y: u32, buf: &Vec<u8>| -> [u8; 4] {
        let idx = ((y * width + x) * 4) as usize;
        [buf[idx], buf[idx + 1], buf[idx + 2], buf[idx + 3]]
    };

    let mut stack = vec![(start_x as i32, start_y as i32)];
    let origin = get_color(start_x, start_y, &data);

    let color_close = |c1: [u8; 4], c2: [u8; 4]| -> bool {
        let rgb_tol = 255.0 * (tolerance / 100.0);
        let alpha_tol = tolerance / 100.0;
        (c1[0] as f32 - c2[0] as f32).abs() <= rgb_tol &&
        (c1[1] as f32 - c2[1] as f32).abs() <= rgb_tol &&
        (c1[2] as f32 - c2[2] as f32).abs() <= rgb_tol &&
        ((c1[3] as f32 / 255.0) - (c2[3] as f32 / 255.0)).abs() <= alpha_tol
    };

    if color_close([fill_r, fill_g, fill_b, fill_a], origin) {
        return Ok(data);
    }

    while let Some((x, y)) = stack.pop() {
        if x < 0 || x >= width as i32 || y < 0 || y >= height as i32 {
            continue;
        }
        let idx = (y as u32 * width + x as u32) as usize;
        if visited[idx] {
            continue;
        }
        visited[idx] = true;
        let color = get_color(x as u32, y as u32, &data);
        if !color_close(color, origin) {
            continue;
        }
        let data_idx = idx * 4;
        data[data_idx] = fill_r;
        data[data_idx + 1] = fill_g;
        data[data_idx + 2] = fill_b;
        data[data_idx + 3] = fill_a;

        stack.push((x + 1, y));
        stack.push((x - 1, y));
        stack.push((x, y + 1));
        stack.push((x, y - 1));
    }

    Ok(data)
}

#[wasm_bindgen]
pub fn hello(name: String) -> String {
    format!("Hello, {}!", name)
}
