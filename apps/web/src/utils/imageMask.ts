export type ImageMaskData = Uint8Array;

export class ImageMask {
  private data: ImageMaskData;

  constructor(private width: number, height: number) {
    this.data = new Uint8Array(width * height);
  }

  get(x: number, y: number) {
    return !!this.data[y * this.width + x];
  }

  set(x: number, y: number, value: boolean) {
    this.data[y * this.width + x] = value ? 1 : 0;
  }

  getData() {
    return this.data;
  }
}

