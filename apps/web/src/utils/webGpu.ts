/// <reference types="@webgpu/types" />

export const requestDevice = async () => {
  if (!navigator.gpu) {
    throw Error("WebGPU not supported.");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  return adapter.requestDevice();
};

type CreateComputePipelineOptions = {
  name: string;
  code: string;
  resultBuffer: { binding: number; size: number };
};
export const createComputePipeline = async (device: GPUDevice, pipelineOptions: CreateComputePipelineOptions) => {
  const { name, code } = pipelineOptions;
  const module = device.createShaderModule({
    label: `${name} shader`,
    code: code,
  });

  const pipeline = device.createComputePipeline({
    label: `${name} pipeline`,
    layout: "auto",
    compute: { module },
  });

  const resultBuffer = device.createBuffer({
    size: pipelineOptions.resultBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const bindGroupEntries = new Map<GPUIndex32, GPUBindingResource>();

  const run = async (runOptions?: { workgroups?: { x: number; y: number; z: number } }) => {
    const bindGroup = device.createBindGroup({
      label: `${name} bind group`,
      layout: pipeline.getBindGroupLayout(0),
      entries: Array.from(bindGroupEntries.entries()).map(([binding, resource]) => ({ binding, resource })),
    });
    const encoder = device.createCommandEncoder({ label: `${name} encoder` });
    const pass = encoder.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(
      runOptions?.workgroups?.x ?? resultBuffer.size,
      runOptions?.workgroups?.y,
      runOptions?.workgroups?.z,
    );
    pass.end();

    const sourceBufferBinding = bindGroupEntries.get(pipelineOptions.resultBuffer.binding) as GPUBufferBinding;

    if (!sourceBufferBinding) {
      throw Error("No source buffer found.");
    }

    encoder.copyBufferToBuffer(sourceBufferBinding.buffer, 0, resultBuffer, 0, resultBuffer.size);

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = resultBuffer.getMappedRange().slice(0);
    resultBuffer.unmap();

    return result;
  };

  const setBuffer = (binding: number, buffer: ArrayBuffer, type: "read" | "read-write" = "read") => {
    const usage =
      type === "read"
        ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        : GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    const gpuBuffer = device.createBuffer({
      label: `${name} buffer(${binding})`,
      size: buffer.byteLength,
      usage,
    });

    bindGroupEntries.set(binding, { buffer: gpuBuffer });

    device.queue.writeBuffer(gpuBuffer, 0, buffer);
  };

  const destroy = () => {
    resultBuffer.destroy();
  };

  return {
    run,
    setBuffer,
    dispose: destroy,
  };
};
