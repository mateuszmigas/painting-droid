import { useEffect, useMemo } from "react";

export const useBlobUrl = (blob: Blob | null | undefined) => {
  const blobUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : ""),
    [blob]
  );

  useEffect(() => {
    return () => {
      blobUrl && URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return blobUrl;
};

