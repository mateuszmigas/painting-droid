export type ByteArray = {
  type: "shared" | "normal";
  data: ArrayBuffer;
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

