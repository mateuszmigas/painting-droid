import { IndexedDBStore } from "@/utils/indexedDBStore";

export const blobsStore = new IndexedDBStore({
  name: "pd-blobs",
  version: 1,
  stores: { blobs: "blob" },
});

