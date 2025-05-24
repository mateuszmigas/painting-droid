// apps/web/src/utils/webgpuFloodFill.ts

export function isWebGPUSupported(): boolean {
  return !!navigator.gpu;
}

interface ShaderParams {
  startX: number; // Added
  startY: number; // Added
  targetColorR: number;
  targetColorG: number;
  targetColorB: number;
  targetColorA: number;
  fillColorR: number;
  fillColorG: number;
  fillColorB: number;
  fillColorA: number;
  tolerance: number;
  width: number;
  height: number;
}

// getPixel and isColorMatch are unused in this version of the file with the simple shader.
// Removing them to clear TS6133 errors. If a more complex CPU-interaction or different shader
// were used, they might be needed.

export async function webgpuFloodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: [number, number, number, number], // Changed from targetColor to fillColor for clarity
  tolerance: number
): Promise<ImageData | null> {
  if (!navigator.gpu) {
    console.error("WebGPU not supported on this browser.");
    return null;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error("Failed to get GPU adapter.");
    return null;
  }

  const device = await adapter.requestDevice();
  if (!device) {
    console.error("Failed to get GPU device.");
    return null;
  }

  const { width, height, data: pixelDataBuffer } = imageData; // Renamed data to avoid conflict

  // Determine the actual target color from the start coordinates
  const startPixelIndex = (startY * width + startX) * 4;
  const targetR = pixelDataBuffer[startPixelIndex];
  const targetG = pixelDataBuffer[startPixelIndex + 1];
  const targetB = pixelDataBuffer[startPixelIndex + 2];
  const targetA = pixelDataBuffer[startPixelIndex + 3];

  // Prepare image data buffer (u32 array)
  // The shader expects u32s (like 0xAABBGGRR or 0xAARRGGBB depending on endianness and how it's read)
  // ImageData data is Uint8ClampedArray [R, G, B, A, R, G, B, A, ...]
  // The current shader does:
  // let r = (pixelColor >> 0) & 0xFF;
  // let g = (pixelColor >> 8) & 0xFF;
  // let b = (pixelColor >> 16) & 0xFF;
  // let a = (pixelColor >> 24) & 0xFF;
  // This implies a u32 format where alpha is most significant, e.g. 0xAABBGGRR (if read as little-endian by shader)
  // Or, if the CPU writes it as ARGB and shader reads as is.
  // Let's assume the Uint32Array conversion handles this correctly for the platform.
  const inputImageDataArray = new Uint32Array(pixelDataBuffer.buffer);

  const imageGpuBuffer = device.createBuffer({
    size: inputImageDataArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Uint32Array(imageGpuBuffer.getMappedRange()).set(inputImageDataArray);
  imageGpuBuffer.unmap();

  // Prepare parameters buffer
  const params: ShaderParams = { // Use ShaderParams type
    // startX and startY are not directly used by this simple shader version,
    // but are part of ShaderParams for consistency or future use.
    // The shader code provided in previous steps (floodFill.wgsl) did not use startX/Y in its main logic.
    // If it were the iterative one, it would be different.
    // For the simple shader (color all matching pixels), startX/Y are not needed by the shader itself.
    // However, the ShaderParams struct in WGSL does have them.
    // Let's assume they are still needed in the struct for now.
    startX: startX, // These are not used by the current simple shader
    startY: startY, // but are in the ShaderParams struct definition
    targetColorR: targetR,
    targetColorG: targetG,
    targetColorB: targetB,
    targetColorA: targetA,
    fillColorR: fillColor[0], // Use the fillColor parameter
    fillColorG: fillColor[1],
    fillColorB: fillColor[2],
    fillColorA: fillColor[3], // Alpha from fillColor is already 0-255
    tolerance,
    width,
    height,
  };

  // Order must match the ShaderParams struct in WGSL if it's being read sequentially.
  // The current WGSL (from previous context, the simple one) is:
  // struct FloodFillParams { startX, startY, targetColorR...GBA, fillColorR...GBA, tolerance, width, height }
  // This order must be respected.
  const paramsArray = new Uint32Array([
    params.startX, params.startY,
    params.targetColorR, params.targetColorG, params.targetColorB, params.targetColorA,
    params.fillColorR, params.fillColorG, params.fillColorB, params.fillColorA,
    params.tolerance, params.width, params.height,
  ]);

  const paramsGpuBuffer = device.createBuffer({
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(paramsGpuBuffer, 0, paramsArray);

  // Fetch shader code
  let shaderCode = "";
  try {
    // Adjust the path as necessary based on your project structure and how files are served.
    // This path assumes the shaders directory is relative to where the script is run or served from.
    const response = await fetch("/src/shaders/floodFill.wgsl");
    if (!response.ok) {
      throw new Error(`Failed to fetch shader: ${response.statusText}`);
    }
    shaderCode = await response.text();
  } catch (error) {
    console.error("Error loading WGSL shader:", error);
    return null;
  }

  if (!shaderCode) {
    console.error("Shader code is empty.");
    return null;
  }

  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  // Create compute pipeline
  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        device.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.COMPUTE,
              buffer: { type: "storage" },
            },
            {
              binding: 1,
              visibility: GPUShaderStage.COMPUTE,
              buffer: { type: "uniform" },
            },
          ],
        }),
      ],
    }),
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  // Create bind group
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: imageGpuBuffer } },
      { binding: 1, resource: { buffer: paramsGpuBuffer } },
    ],
  });

  // Create command encoder and dispatch compute shader
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  const workgroupCountX = Math.ceil(width / 8);
  const workgroupCountY = Math.ceil(height / 8);
  passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, 1);
  passEncoder.end();

  // Create GPU buffer for reading back the result
  const readBuffer = device.createBuffer({
    size: inputImageDataArray.byteLength,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(
    imageGpuBuffer,
    0, // Source offset
    readBuffer,
    0, // Destination offset
    inputImageDataArray.byteLength
  );

  // Submit commands
  device.queue.submit([commandEncoder.finish()]);

  // Read back the data
  await readBuffer.mapAsync(GPUMapMode.READ);
  const resultArray = new Uint8ClampedArray(readBuffer.getMappedRange());
  const resultImageData = new ImageData(resultArray, width, height);

  readBuffer.unmap();
  imageGpuBuffer.destroy();
  paramsGpuBuffer.destroy();
  readBuffer.destroy();

  return resultImageData;
}
