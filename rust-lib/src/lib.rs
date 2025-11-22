use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet() -> String {
    "Hello from Rust!".to_string()
}

#[wasm_bindgen]
pub fn apply_grayscale(image_data: &mut [u8]) {
    for pixel in image_data.chunks_exact_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;
        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
        pixel[0] = gray;
        pixel[1] = gray;
        pixel[2] = gray;
    }
}

#[wasm_bindgen]
pub fn apply_invert(image_data: &mut [u8]) {
    for pixel in image_data.chunks_exact_mut(4) {
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];
    }
}

#[wasm_bindgen]
pub fn apply_sepia(image_data: &mut [u8]) {
    for pixel in image_data.chunks_exact_mut(4) {
        let r = pixel[0] as f32;
        let g = pixel[1] as f32;
        let b = pixel[2] as f32;

        let new_r = (r * 0.393 + g * 0.769 + b * 0.189).min(255.0);
        let new_g = (r * 0.349 + g * 0.686 + b * 0.168).min(255.0);
        let new_b = (r * 0.272 + g * 0.534 + b * 0.131).min(255.0);

        pixel[0] = new_r as u8;
        pixel[1] = new_g as u8;
        pixel[2] = new_b as u8;
    }
}

#[wasm_bindgen]
pub fn apply_brightness(image_data: &mut [u8], factor: f32) {
    for pixel in image_data.chunks_exact_mut(4) {
        pixel[0] = ((pixel[0] as f32 * factor).min(255.0)) as u8;
        pixel[1] = ((pixel[1] as f32 * factor).min(255.0)) as u8;
        pixel[2] = ((pixel[2] as f32 * factor).min(255.0)) as u8;
    }
}

// Sobel Edge Detection
#[wasm_bindgen]
pub fn apply_sobel(image_data: &mut [u8], width: u32, height: u32) {
    let w = width as usize;
    let h = height as usize;
    let src = image_data.to_vec(); // Clone original to read from

    for y in 1..h-1 {
        for x in 1..w-1 {
            let mut gx = 0.0;
            let mut gy = 0.0;

            for dy in 0..3 {
                for dx in 0..3 {
                    let pixel_idx = ((y + dy - 1) * w + (x + dx - 1)) * 4;
                    // Use Grayscale intensity for edge detection
                    let val = (src[pixel_idx] as f32 * 0.299) + 
                              (src[pixel_idx+1] as f32 * 0.587) + 
                              (src[pixel_idx+2] as f32 * 0.114);
                    
                    let kernel_x = match (dx, dy) {
                        (0,0) => -1.0, (2,0) => 1.0,
                        (0,1) => -2.0, (2,1) => 2.0,
                        (0,2) => -1.0, (2,2) => 1.0,
                        _ => 0.0
                    };

                    let kernel_y = match (dx, dy) {
                        (0,0) => -1.0, (1,0) => -2.0, (2,0) => -1.0,
                        (0,2) => 1.0, (1,2) => 2.0, (2,2) => 1.0,
                        _ => 0.0
                    };

                    gx += val * kernel_x;
                    gy += val * kernel_y;
                }
            }

            let mag = (gx * gx + gy * gy).sqrt().min(255.0) as u8;
            let idx = (y * w + x) * 4;
            
            image_data[idx] = mag;
            image_data[idx + 1] = mag;
            image_data[idx + 2] = mag;
            image_data[idx + 3] = 255; // Ensure Alpha is opaque
        }
    }
}

#[wasm_bindgen]
pub fn apply_blur(image_data: &mut [u8], width: u32, height: u32, radius: u32) {
    let w = width as usize;
    let h = height as usize;
    let r = radius as usize;
    let src = image_data.to_vec();

    for y in 0..h {
        for x in 0..w {
            let mut r_acc = 0u32;
            let mut g_acc = 0u32;
            let mut b_acc = 0u32;
            let mut count = 0u32;

            let y_start = y.saturating_sub(r);
            let y_end = (y + r).min(h - 1);
            let x_start = x.saturating_sub(r);
            let x_end = (x + r).min(w - 1);

            for dy in y_start..=y_end {
                for dx in x_start..=x_end {
                    let idx = (dy * w + dx) * 4;
                    r_acc += src[idx] as u32;
                    g_acc += src[idx + 1] as u32;
                    b_acc += src[idx + 2] as u32;
                    count += 1;
                }
            }

            let idx = (y * w + x) * 4;
            image_data[idx] = (r_acc / count) as u8;
            image_data[idx + 1] = (g_acc / count) as u8;
            image_data[idx + 2] = (b_acc / count) as u8;
        }
    }
}