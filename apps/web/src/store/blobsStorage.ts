import { IndexedDBStore } from "@/utils/indexedDBStore";
import { isApple } from "@/utils/platform";
import { blobToArrayBuffer, arrayBufferToBlob } from "@/utils/image";

const blobsDb = new IndexedDBStore({
  name: "pd-blobs",
  version: 1,
  stores: { blobs: "blob" },
});

/*
  Due to bug with storing Blobs in IndexedDB in older versions of Safari (happens only in Tauri on macOS),
  we store Blobs as ArrayBuffers and convert them back to Blobs when reading them.
*/
const useArrayBuffer = isApple();

export const blobsStorage = {
  getBlobs: async () => {
    try {
      const result = await blobsDb.getValuesByKey("blobs");

      if (useArrayBuffer) {
        for (const [key, arrayBuffer] of result) {
          const blob = await arrayBufferToBlob(arrayBuffer as never);
          result.set(key, blob);
        }
      }
      return result;
    } catch (e) {
      //todo better error handling
      console.error(e);
      return new Map<string, Blob>();
    }
  },
  setBlobs: async (blobs: { key: string; value: Blob }[]) => {
    try {
      await blobsDb.deleteAll("blobs");

      if (useArrayBuffer) {
        for (const blob of blobs) {
          blob.value = (await blobToArrayBuffer(blob.value)) as never;
        }
      }

      await blobsDb.putValuesWithKeys("blobs", blobs);
    } catch (e) {
      console.error(e);
    }
  },
};

