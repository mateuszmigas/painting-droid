export type PlatformFileSystem = {
  openFile: (options: {
    extensions: string[];
  }) => Promise<{ name: string; path: string } | null>;
  readFileAsDataURL: (path: string) => Promise<string>;
  readFileAsText: (path: string) => Promise<string>;
  saveTextToFile: (
    text: string,
    filename: string,
    extension: string
  ) => Promise<void>;
  saveBlobToFile: (
    blob: Blob,
    filename: string,
    extension: string
  ) => Promise<void>;
};

