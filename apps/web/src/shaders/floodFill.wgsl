@group(0) @binding(0) var<storage, read_write> pixels: array<u32>;      // Pixel color data
@group(0) @binding(1) var<storage, read> currentState: array<u32>; // 0 if not filled, 1 if filled in previous iteration
@group(0) @binding(2) var<storage, read_write> nextState: array<u32>;  // MUST BE CLEARED TO 0s before dispatch if shader doesn't write 0s for non-filled pixels
@group(0) @binding(3) var<uniform> params: FloodFillParams;
@group(0) @binding(4) var<storage, read_write> pixelsChanged: array<atomic<u32>>; // Single element array to track if any pixel changed

struct FloodFillParams {
  targetColorR: u32,
  targetColorG: u32,
  targetColorB: u32,
  targetColorA: u32,
  fillColorR: u32,
  fillColorG: u32,
  fillColorB: u32,
  fillColorA: u32,
  tolerance: u32,
  width: u32,
  height: u32,
  // startX, startY are not directly used per-pixel in this version of the expansion shader
  // but are used by the calling code to initialize the first pixel in currentState
};

fn is_color_match(pixelColor: u32, targetR: u32, targetG: u32, targetB: u32, targetA: u32, tolerance: u32) -> bool {
  let r = (pixelColor >> 0) & 0xFF;
  let g = (pixelColor >> 8) & 0xFF;
  let b = (pixelColor >> 16) & 0xFF;
  let a = (pixelColor >> 24) & 0xFF;

  let dr = abs(i32(r) - i32(targetR));
  let dg = abs(i32(g) - i32(targetG));
  let db = abs(i32(b) - i32(targetB));
  let da = abs(i32(a) - i32(targetA));

  return dr <= i32(tolerance) && dg <= i32(tolerance) && db <= i32(tolerance) && da <= i32(tolerance);
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let x = global_id.x;
  let y = global_id.y;

  if (x >= params.width || y >= params.height) {
    return;
  }

  let pixelIndex = y * params.width + x;

  // If this pixel is already part of the fill in the current wave (currentState),
  // ensure it's marked in the next state so it propagates.
  if (currentState[pixelIndex] == 1u) {
    nextState[pixelIndex] = 1u;
    // pixels[pixelIndex] should have already been colored when it was first added to the fill.
    return; // No further processing needed for this pixel in this pass.
  }

  // If this pixel is NOT fillable (doesn't match target color), it cannot be part of the fill.
  // Shader relies on nextState being cleared to 0s before the pass. If not, explicitly write 0.
  // nextState[pixelIndex] = 0u; // (If not pre-cleared)
  let originalPixelColor = pixels[pixelIndex];
  if (!is_color_match(originalPixelColor, params.targetColorR, params.targetColorG, params.targetColorB, params.targetColorA, params.tolerance)) {
    return;
  }

  // This pixel matches the target color and is not yet filled (currentState[pixelIndex] == 0u).
  // Check if any of its direct neighbors were filled in the previous iteration (currentState == 1u).
  var connectedToFill = false;
  // Check Up
  if (y > 0u && currentState[(y - 1u) * params.width + x] == 1u) { connectedToFill = true; }
  // Check Down
  if (!connectedToFill && y < params.height - 1u && currentState[(y + 1u) * params.width + x] == 1u) { connectedToFill = true; }
  // Check Left
  if (!connectedToFill && x > 0u && currentState[y * params.width + (x - 1u)] == 1u) { connectedToFill = true; }
  // Check Right
  if (!connectedToFill && x < params.width - 1u && currentState[y * params.width + (x + 1u)] == 1u) { connectedToFill = true; }

  if (connectedToFill) {
    let newPixelColor = (params.fillColorA << 24) | (params.fillColorB << 16) | (params.fillColorG << 8) | params.fillColorR;
    pixels[pixelIndex] = newPixelColor; // Update the actual image pixel
    nextState[pixelIndex] = 1u;         // Mark as filled in this pass for the next iteration's currentState
    atomicStore(&pixelsChanged[0], 1u); // Signal that a change occurred to continue iteration
  } else {
    // If it matched target color, but no neighbors were filled, it's not connected yet.
    // Shader relies on nextState being cleared to 0s. If not, explicitly write 0.
    // nextState[pixelIndex] = 0u; // (If not pre-cleared)
  }
}
