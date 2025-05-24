// apps/web/src/utils/webgpuFloodFill.ts
import floodFillShaderWGSL from '../shaders/floodFill.wgsl?raw';

export function isWebGPUSupported(): boolean {
  return !!navigator.gpu;
}

// This interface must match the 'FloodFillParams' struct in floodFill.wgsl
interface ShaderParams {
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
  // Note: startX, startY are NOT in the shader's FloodFillParams struct
  // for the iterative version, so they are not included here.
}

// Helper function to check if a starting pixel matches the target criteria.
// This is a CPU-side check before starting GPU operations.
function checkStartPixel(
    initialPixelData: Uint8ClampedArray,
    startIndex: number,
    targetR: number, targetG: number, targetB: number, targetA: number,
    tolerance: number
): boolean {
    const r = initialPixelData[startIndex];
    const g = initialPixelData[startIndex + 1];
    const b = initialPixelData[startIndex + 2];
    const a = initialPixelData[startIndex + 3];

    const dr = Math.abs(r - targetR);
    const dg = Math.abs(g - targetG);
    const db = Math.abs(b - targetB);
    const da = Math.abs(a - targetA);
    return dr <= tolerance && dg <= tolerance && db <= tolerance && da <= tolerance;
}


export async function webgpuFloodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  fillColor: [number, number, number, number], // RGBA array, A is 0-255
  tolerance: number // Absolute tolerance 0-255
): Promise<ImageData | null> {
  if (!isWebGPUSupported()) { // Use the exported function for clarity
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

  const { width, height, data: initialPixelDataBuffer } = imageData;
  const initialPixelArrayU32 = new Uint32Array(initialPixelDataBuffer.buffer);
  const stateSize = width * height * 4; // Size in bytes for u32 state array

  // 1. Determine the actual target color from the start coordinates
  const startPixelFlatIndex = (startY * width + startX) * 4; // For Uint8ClampedArray
  const targetR = initialPixelDataBuffer[startPixelFlatIndex];
  const targetG = initialPixelDataBuffer[startPixelFlatIndex + 1];
  const targetB = initialPixelDataBuffer[startPixelFlatIndex + 2];
  const targetA = initialPixelDataBuffer[startPixelFlatIndex + 3];

  // 2. Buffer Creation
  // PixelsGpuBuffer (will be modified)
  const pixelsGpuBuffer = device.createBuffer({
    size: initialPixelArrayU32.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Uint32Array(pixelsGpuBuffer.getMappedRange()).set(initialPixelArrayU32);
  pixelsGpuBuffer.unmap();

  // currentStateGpuBuffer
  const stateInitial = new Uint32Array(width * height); // All 0s
  const startPixelIndexU32 = startY * width + startX; // For u32 array

  if (checkStartPixel(initialPixelDataBuffer, startPixelFlatIndex, targetR, targetG, targetB, targetA, tolerance)) {
    stateInitial[startPixelIndexU32] = 1; // Mark start pixel as filled
    // Pre-color the starting pixel in the main buffer
    const fillU32 = (fillColor[3] << 24) | (fillColor[2] << 16) | (fillColor[1] << 8) | fillColor[0];
    // Create a temporary buffer to write the single pixel color to avoid large array creation
    const tempFillBuffer = new Uint32Array([fillU32]);
    device.queue.writeBuffer(pixelsGpuBuffer, startPixelIndexU32 * 4, tempFillBuffer);
  } else {
    console.log("Start pixel does not match target color criteria. No fill performed.");
    // Return original image data as no fill will happen, or a copy if preferred
    return new ImageData(new Uint8ClampedArray(initialPixelArrayU32.buffer), width, height);
  }

  let currentStateGpuBuffer = device.createBuffer({
    size: stateSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  new Uint32Array(currentStateGpuBuffer.getMappedRange()).set(stateInitial);
  currentStateGpuBuffer.unmap();

  // nextStateGpuBuffer (initialized to 0s)
  let nextStateGpuBuffer = device.createBuffer({
    size: stateSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true, // mappedAtCreation makes it easy to zero-fill
  });
  new Uint32Array(nextStateGpuBuffer.getMappedRange()).set(new Uint32Array(width*height)); // Ensure it's zeroed
  nextStateGpuBuffer.unmap();


  // pixelsChangedGpuBuffer
  const pixelsChangedGpuBuffer = device.createBuffer({
    size: 4, // single u32
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_READ,
  });
  const zeroArrayForPixelsChanged = new Uint32Array([0]); // For resetting

  // paramsGpuBuffer
  const params: ShaderParams = {
    targetColorR: targetR, targetColorG: targetG, targetColorB: targetB, targetColorA: targetA,
    fillColorR: fillColor[0], fillColorG: fillColor[1], fillColorB: fillColor[2], fillColorA: fillColor[3],
    tolerance, width, height,
  };
  const paramsArray = new Uint32Array([
    params.targetColorR, params.targetColorG, params.targetColorB, params.targetColorA,
    params.fillColorR, params.fillColorG, params.fillColorB, params.fillColorA,
    params.tolerance, params.width, params.height,
  ]);
  const paramsGpuBuffer = device.createBuffer({
    size: paramsArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(paramsGpuBuffer, 0, paramsArray);

  // Shader Code (already imported via Vite ?raw)
  const shaderCode = floodFillShaderWGSL;
  if (!shaderCode) {
    console.error("Shader code is empty. Check import.");
    // Cleanup before returning
    pixelsGpuBuffer.destroy();
    currentStateGpuBuffer.destroy();
    nextStateGpuBuffer.destroy();
    pixelsChangedGpuBuffer.destroy();
    paramsGpuBuffer.destroy();
    return null;
  }
  const shaderModule = device.createShaderModule({ code: shaderCode });

  // 3. BindGroupLayout
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }, // pixels
      { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // currentState
      { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }, // nextState
      { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },   // params
      { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },   // pixelsChanged
    ],
  });

  // Pipeline
  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    compute: { module: shaderModule, entryPoint: "main" },
  });

  // 5. Iteration Loop
  const workgroupCountX = Math.ceil(width / 8);
  const workgroupCountY = Math.ceil(height / 8);
  const maxIterations = width * height; // Safety break
  let iteration = 0;

  for (iteration = 0; iteration < maxIterations; iteration++) {
    device.queue.writeBuffer(pixelsChangedGpuBuffer, 0, zeroArrayForPixelsChanged); // Reset flag

    const commandEncoder = device.createCommandEncoder();
    commandEncoder.clearBuffer(nextStateGpuBuffer); // Clear nextState to 0s

    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    const bindGroup = device.createBindGroup({ // Bind group created per iteration if buffers swap
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: pixelsGpuBuffer } },
            { binding: 1, resource: { buffer: currentStateGpuBuffer } },
            { binding: 2, resource: { buffer: nextStateGpuBuffer } },
            { binding: 3, resource: { buffer: paramsGpuBuffer } },
            { binding: 4, resource: { buffer: pixelsChangedGpuBuffer } },
        ],
    });
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY, 1);
    passEncoder.end();
    
    // Copy nextState to currentState for the next iteration
    commandEncoder.copyBufferToBuffer(nextStateGpuBuffer, 0, currentStateGpuBuffer, 0, stateSize);
    
    // Create a temporary buffer to read back pixelsChangedGpuBuffer
    const readbackPixelsChangedBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    commandEncoder.copyBufferToBuffer(pixelsChangedGpuBuffer, 0, readbackPixelsChangedBuffer, 0, 4);

    device.queue.submit([commandEncoder.finish()]);
    
    await readbackPixelsChangedBuffer.mapAsync(GPUMapMode.READ);
    const changedResult = new Uint32Array(readbackPixelsChangedBuffer.getMappedRange());
    const pixelsWereChanged = changedResult[0] === 1;
    readbackPixelsChangedBuffer.unmap(); // Unmap before destroying
    readbackPixelsChangedBuffer.destroy();

    if (!pixelsWereChanged) {
      break; 
    }
  }
  if (iteration === maxIterations) {
      console.warn("WebGPU Flood Fill reached max iterations.");
  }

  // 6. Result Handling & Cleanup
  const resultReadBuffer = device.createBuffer({
    size: initialPixelArrayU32.byteLength,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const commandEncoderFinal = device.createCommandEncoder();
  commandEncoderFinal.copyBufferToBuffer(pixelsGpuBuffer, 0, resultReadBuffer, 0, initialPixelArrayU32.byteLength);
  device.queue.submit([commandEncoderFinal.finish()]);

  await resultReadBuffer.mapAsync(GPUMapMode.READ);
  // It's crucial that resultReadBuffer.getMappedRange() is not accessed after unmap or buffer destruction.
  // Create a copy of the data.
  const finalPixelDataArrayU8 = new Uint8ClampedArray(resultReadBuffer.getMappedRange().slice(0));
  resultReadBuffer.unmap();

  pixelsGpuBuffer.destroy();
  currentStateGpuBuffer.destroy();
  nextStateGpuBuffer.destroy();
  pixelsChangedGpuBuffer.destroy();
  paramsGpuBuffer.destroy();
  resultReadBuffer.destroy();

  return new ImageData(finalPixelDataArrayU8, width, height);
}
