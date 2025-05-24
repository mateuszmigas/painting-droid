// apps/web/src/utils/webgpuFloodFill.ts

export function isWebGPUSupported(): boolean {
  return !!navigator.gpu;
}

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
}

function getPixel(imageData: Uint32Array, x: number, y: number, width: number): number {
    if (x < 0 || x >= width || y < 0 || y >= imageData.length / width) return 0;
    return imageData[y * width + x];
}

function isColorMatch(
    pixelColor: number, // u32 color
    targetR: number, targetG: number, targetB: number, targetA: number,
    tolerance: number
): boolean {
    const r = (pixelColor >> 0) & 0xFF;
    const g = (pixelColor >> 8) & 0xFF;
    const b = (pixelColor >> 16) & 0xFF;
    const a = (pixelColor >> 24) & 0xFF;

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

  const { width, height, data } = imageData;

  // Prepare image data buffer (u32 array)
  const inputImageDataArray = new Uint32Array(data.buffer);

  const imageGpuBuffer = device.createBuffer({
    size: inputImageDataArray.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Uint32Array(imageGpuBuffer.getMappedRange()).set(inputImageDataArray);
  imageGpuBuffer.unmap();

  // Prepare parameters buffer
  const params: FloodFillParams = {
    startX,
    startY,
    targetColorR: targetColor[0],
    targetColorG: targetColor[1],
    targetColorB: targetColor[2],
    targetColorA: targetColor[3],
    fillColorR: targetColor[0], // Using targetColor as fillColor
    fillColorG: targetColor[1],
    fillColorB: targetColor[2],
    fillColorA: targetColor[3],
    tolerance,
    width,
    height,
  };

  const paramsArray = new Uint32Array([
    params.startX,
    params.startY,
    params.startX,
    params.startY,
    params.targetColorR,
    params.targetColorG,
    params.targetColorB,
    params.targetColorA,
    params.fillColorR,
    params.fillColorG,
    params.fillColorB,
    params.fillColorA,
    params.tolerance,
    params.width,
    params.height,
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
