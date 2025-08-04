export type ByteArray = {
  type: "shared" | "normal";
  data: ArrayBuffer | SharedArrayBuffer;
};

export const createByteArray = (byteLength: number): ByteArray => {
  if (crossOriginIsolated) {
    return {
      type: "shared",
      data: new SharedArrayBuffer(byteLength),
    };
  }
  return {
    type: "normal",
    data: new ArrayBuffer(byteLength),
  };
};

export const ensureArrayBuffer = (buffer: ArrayBuffer | SharedArrayBuffer): ArrayBuffer => {
  if (buffer instanceof SharedArrayBuffer) {
    return buffer.slice(0) as unknown as ArrayBuffer;
  }
  return buffer;
};
