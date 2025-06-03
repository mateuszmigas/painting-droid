// GPU accelerated flood fill utilities
import type { ImageUncompressed } from "./imageData";
import type { Position } from "./common";
import type { RgbaColor } from "./color";
import { requestDevice } from "./webGpu";
import { generateFillMaskFromBitmap, fillImageWithMask, getPixelColor } from "./imageOperations";

const maskShader = /* wgsl */ `
struct Config {
  width: u32;
  height: u32;
  r: f32;
  g: f32;
  b: f32;
  a: f32;
  tolerance_rgb: f32;
  tolerance_a: f32;
};

@group(0) @binding(0) var<storage, read> data: array<u8>;
@group(0) @binding(1) var<storage, read_write> mask: array<u32>;
@group(0) @binding(2) var<uniform> cfg: Config;

fn within_tolerance(r: f32, g: f32, b: f32, a: f32) -> bool {
  return abs(r - cfg.r) <= cfg.tolerance_rgb &&
    abs(g - cfg.g) <= cfg.tolerance_rgb &&
    abs(b - cfg.b) <= cfg.tolerance_rgb &&
    abs(a - cfg.a) <= cfg.tolerance_a;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
  let index = id.x;
  if (index >= cfg.width * cfg.height) { return; }
  let base = index * 4u;
  let r = f32(data[base]);
  let g = f32(data[base + 1u]);
  let b = f32(data[base + 2u]);
  let a = f32(data[base + 3u]) / 255.0;
  if (within_tolerance(r, g, b, a)) {
    mask[index] = 1u;
  } else {
    mask[index] = 0u;
  }
}
`;

export const floodFillGpu = async (
  image: ImageUncompressed,
  position: Position,
  color: RgbaColor,
  tolerance: number
): Promise<ImageUncompressed> => {
  const device = await requestDevice();
  const total = image.width * image.height;
  const maskBufferSize = total * 4;

  const module = device.createShaderModule({ code: maskShader });
  const pipeline = device.createComputePipeline({ layout: "auto", compute: { module } });

  const imageBuffer = device.createBuffer({
    size: image.data.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(imageBuffer, 0, image.data);

  const maskBuffer = device.createBuffer({
    size: maskBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const toleranceRgb = 255 * (tolerance / 100);
  const toleranceA = tolerance / 100;
  const origin = getPixelColor(position, image);
  const configArray = new Float32Array([
    image.width,
    image.height,
    origin.r,
    origin.g,
    origin.b,
    origin.a,
    toleranceRgb,
    toleranceA,
  ]);
  const configBuffer = device.createBuffer({
    size: configArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(configBuffer, 0, configArray.buffer);

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: imageBuffer } },
      { binding: 1, resource: { buffer: maskBuffer } },
      { binding: 2, resource: { buffer: configBuffer } },
    ],
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(Math.ceil(total / 64));
  pass.end();

  const readBuffer = device.createBuffer({
    size: maskBufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  encoder.copyBufferToBuffer(maskBuffer, 0, readBuffer, 0, maskBufferSize);

  device.queue.submit([encoder.finish()]);
  await readBuffer.mapAsync(GPUMapMode.READ);
  const maskData = new Uint8Array(readBuffer.getMappedRange().slice(0));
  readBuffer.unmap();

  const mask = { width: image.width, height: image.height, data: maskData };
  const fillMask = generateFillMaskFromBitmap(mask, position);
  fillImageWithMask(image, fillMask, color);

  imageBuffer.destroy();
  maskBuffer.destroy();
  configBuffer.destroy();
  readBuffer.destroy();

  return image;
};

