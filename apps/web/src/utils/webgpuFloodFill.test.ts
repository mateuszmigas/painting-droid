import { describe, it, expect, beforeAll, test } from 'vitest';
import { webgpuFloodFill, isWebGPUSupported } from './webgpuFloodFill';
import { floodFill as cpuFloodFill } from './imageOperations';
import { type RgbaColor, areColorsClose } from './color';

// Helper to create RGBA color object
const createRgba = (r: number, g: number, b: number, aAlpha: number = 1): RgbaColor => ({ r, g, b, a: aAlpha });
// Helper to create fill color array for WebGPU [R, G, B, A] with A as 0-255
const createFillColorArray = (color: RgbaColor): [number, number, number, number] => [
  color.r,
  color.g,
  color.b,
  Math.round(color.a * 255),
];

// Helper to create ImageData
function createImageDataFromColorArray(
  width: number,
  height: number,
  colorData: (RgbaColor | null)[][] // null for transparent or default black
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelColor = colorData[y]?.[x];
      const index = (y * width + x) * 4;
      if (pixelColor) {
        data[index] = pixelColor.r;
        data[index + 1] = pixelColor.g;
        data[index + 2] = pixelColor.b;
        data[index + 3] = Math.round(pixelColor.a * 255);
      } else {
        // Default to transparent black if null
        data[index] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 0;
      }
    }
  }
  return new ImageData(data, width, height);
}

// Helper to compare two ImageData objects
function compareImageData(img1: ImageData, img2: ImageData): boolean {
  if (img1.width !== img2.width || img1.height !== img2.height) {
    console.error("Dimensions differ:", 
      `img1: ${img1.width}x${img1.height}`, 
      `img2: ${img2.width}x${img2.height}`
    );
    return false;
  }
  if (img1.data.length !== img2.data.length) {
    // This should not happen if dimensions are same, but good check
    console.error("Data lengths differ:", 
      `img1: ${img1.data.length}`, 
      `img2: ${img2.data.length}`
    );
    return false;
  }
  for (let i = 0; i < img1.data.length; i++) {
    if (img1.data[i] !== img2.data[i]) {
      const pixelIndex = Math.floor(i / 4);
      const x = pixelIndex % img1.width;
      const y = Math.floor(pixelIndex / img1.width);
      const component = i % 4; // 0=R, 1=G, 2=B, 3=A
      console.error(
        `Pixel data differs at index ${i} (pixel [${x},${y}], component ${component}): img1=${img1.data[i]}, img2=${img2.data[i]}`
      );
      return false;
    }
  }
  return true;
}

// Color definitions
const RED = createRgba(255, 0, 0);
const GREEN = createRgba(0, 255, 0);
const BLUE = createRgba(0, 0, 255);
const BLACK = createRgba(0, 0, 0);
const WHITE = createRgba(255, 255, 255);
const TRANSPARENT_BLACK = createRgba(0,0,0,0);

describe('isWebGPUSupported', () => {
  it('should return a boolean', () => {
    expect(typeof isWebGPUSupported()).toBe('boolean');
  });

  // Cannot reliably test true/false in all test environments without more complex setup
  // For now, just check the type. Actual functionality will be apparent if webgpuFloodFill tests run/skip.
});

describe('webgpuFloodFill vs cpuFloodFill', () => {
  // Skip all WebGPU tests if navigator.gpu is not available in the test environment
  const skipWebGPU = test.skipIf(!globalThis.navigator?.gpu);

  skipWebGPU('should produce identical results for a simple fill', async () => {
    const width = 4;
    const height = 4;
    const imageArray: (RgbaColor | null)[][] = [
      [RED, RED, RED, RED],
      [RED, BLACK, BLACK, RED],
      [RED, BLACK, BLACK, RED],
      [RED, RED, RED, RED],
    ];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);
    
    const startX = 1;
    const startY = 1;
    const fillColor = GREEN;
    const tolerance = 0; // Exact match

    // CPU version
    const cpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const expectedOutput = cpuFloodFill(
      cpuInput,
      { x: startX, y: startY },
      fillColor,
      (targetColor, originColor) => areColorsClose(targetColor, originColor, tolerance)
    );

    // WebGPU version
    const gpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const actualOutput = await webgpuFloodFill(
      gpuInput,
      startX,
      startY,
      createFillColorArray(fillColor),
      tolerance
    );

    expect(actualOutput).not.toBeNull();
    if (actualOutput) {
      const match = compareImageData(actualOutput, expectedOutput);
      if (!match) {
        console.log("Expected (CPU):", expectedOutput.data);
        console.log("Actual (GPU):", actualOutput.data);
      }
      expect(match).toBe(true);
    }
  });

  skipWebGPU('should handle tolerance correctly', async () => {
    const width = 3;
    const height = 1;
    const slightlyOffRed = createRgba(250, 10, 10); // Close to RED
    const imageArray: (RgbaColor | null)[][] = [
      [RED, slightlyOffRed, BLUE],
    ];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);

    const startX = 0;
    const startY = 0;
    const fillColor = GREEN;
    
    // Test case 1: Low tolerance, should only fill RED
    let tolerance = 5; // Max diff of 5 per channel
    let cpuInput1 = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    let expected1 = cpuFloodFill(cpuInput1, { x: startX, y: startY }, fillColor, 
      (target, origin) => areColorsClose(target, origin, tolerance, false) // Assuming tolerance in areColorsClose is %
    );
    // For direct comparison, we need to ensure `areColorsClose` is using absolute tolerance if webgpu is.
    // The webgpuFloodFill uses absolute tolerance. cpuFloodFill's `areColorsClose` might use percentage.
    // For this test, let's ensure `areColorsClose` uses an absolute interpretation matching the shader.
    // The shader has `abs(i32(r) - i32(params.targetColorR)) <= i32(params.tolerance)`.
    // `areColorsClose` has: `Math.abs(c1.r - c2.r) <= tolerance && ...` if `isPercent = false`.
    // So, we set `isPercent = false` for cpuFloodFill's callback.

    let gpuInput1 = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    let actual1 = await webgpuFloodFill(gpuInput1, startX, startY, createFillColorArray(fillColor), tolerance);
    expect(actual1).not.toBeNull();
    if(actual1) expect(compareImageData(actual1, expected1)).toBe(true);

    // Test case 2: Higher tolerance, should fill RED and slightlyOffRed
    tolerance = 15; // Max diff of 15 per channel
    let cpuInput2 = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    let expected2 = cpuFloodFill(cpuInput2, { x: startX, y: startY }, fillColor, 
      (target, origin) => areColorsClose(target, origin, tolerance, false)
    );
    let gpuInput2 = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    let actual2 = await webgpuFloodFill(gpuInput2, startX, startY, createFillColorArray(fillColor), tolerance);
    expect(actual2).not.toBeNull();
    if(actual2) expect(compareImageData(actual2, expected2)).toBe(true);
  });

  skipWebGPU('should respect connectivity (U-shape)', async () => {
    const width = 5;
    const height = 3;
    const C = BLACK; // Channel color
    const F = WHITE; // Fillable color (initially)
    const imageArray: (RgbaColor | null)[][] = [
      [C, C, C, C, C],
      [C, F, F, F, C],
      [C, F, C, F, C], // U-shape, F at (1,2) is connected to F at (1,1) but not F at (3,2)
    ];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);
    
    const startX = 1;
    const startY = 2; // Start on one leg of the U
    const fillColor = GREEN;
    const tolerance = 0;

    const cpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const expectedOutput = cpuFloodFill(cpuInput, { x: startX, y: startY }, fillColor,
      (target, origin) => areColorsClose(target, origin, tolerance, false)
    );

    const gpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const actualOutput = await webgpuFloodFill(gpuInput, startX, startY, createFillColorArray(fillColor), tolerance);

    expect(actualOutput).not.toBeNull();
    if (actualOutput) {
      const match = compareImageData(actualOutput, expectedOutput);
       if (!match) {
        console.log("Expected (CPU) U-shape:", expectedOutput.data, "width:", expectedOutput.width, "height:", expectedOutput.height);
        console.log("Actual (GPU) U-shape:", actualOutput.data, "width:", actualOutput.width, "height:", actualOutput.height);
      }
      expect(match).toBe(true);
    }
  });
  
  skipWebGPU('should handle filling at the border', async () => {
    const width = 3;
    const height = 3;
    const imageArray: (RgbaColor | null)[][] = [
      [BLACK, BLACK, BLACK],
      [BLACK, BLACK, BLACK],
      [BLACK, BLACK, BLACK],
    ];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);
    
    const startX = 0;
    const startY = 0;
    const fillColor = GREEN;
    const tolerance = 0;

    const cpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const expectedOutput = cpuFloodFill(cpuInput, { x: startX, y: startY }, fillColor,
      (target, origin) => areColorsClose(target, origin, tolerance, false)
    );

    const gpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const actualOutput = await webgpuFloodFill(gpuInput, startX, startY, createFillColorArray(fillColor), tolerance);

    expect(actualOutput).not.toBeNull();
    if(actualOutput) expect(compareImageData(actualOutput, expectedOutput)).toBe(true);
  });

  skipWebGPU('should do nothing if start point does not match target criteria', async () => {
    const width = 3;
    const height = 3;
    const imageArray: (RgbaColor | null)[][] = [
      [RED, RED, RED],
      [RED, GREEN, RED], // Start point (1,1) is GREEN
      [RED, RED, RED],
    ];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);
    
    const startX = 1;
    const startY = 1; 
    // Target color for flood fill is derived from startX, startY. So target is GREEN.
    const fillColor = BLUE; // Fill with BLUE if it were to fill
    const tolerance = 0;

    // CPU: cpuFloodFill derives target color from start point.
    const cpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const expectedOutput = cpuFloodFill(cpuInput, { x: startX, y: startY }, fillColor,
      (target, origin) => areColorsClose(target, origin, tolerance, false)
    );
    // In this case, only the GREEN pixel at (1,1) should become BLUE.

    // WebGPU: webgpuFloodFill also derives target color from start point.
    const gpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const actualOutput = await webgpuFloodFill(gpuInput, startX, startY, createFillColorArray(fillColor), tolerance);

    expect(actualOutput).not.toBeNull();
    if (actualOutput) {
      const match = compareImageData(actualOutput, expectedOutput);
      if (!match) {
        console.log("Expected (CPU) no-match-start:", expectedOutput.data);
        console.log("Actual (GPU) no-match-start:", actualOutput.data);
      }
      expect(match).toBe(true);
    }
  });

  skipWebGPU('should work for a 1x1 pixel image', async () => {
    const width = 1;
    const height = 1;
    const imageArray: (RgbaColor | null)[][] = [[BLACK]];
    const inputImageData = createImageDataFromColorArray(width, height, imageArray);
    
    const startX = 0;
    const startY = 0;
    const fillColor = GREEN;
    const tolerance = 0;

    const cpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const expectedOutput = cpuFloodFill(cpuInput, { x: startX, y: startY }, fillColor,
      (target, origin) => areColorsClose(target, origin, tolerance, false)
    );

    const gpuInput = new ImageData(new Uint8ClampedArray(inputImageData.data), width, height);
    const actualOutput = await webgpuFloodFill(gpuInput, startX, startY, createFillColorArray(fillColor), tolerance);

    expect(actualOutput).not.toBeNull();
    if(actualOutput) expect(compareImageData(actualOutput, expectedOutput)).toBe(true);
  });

});
