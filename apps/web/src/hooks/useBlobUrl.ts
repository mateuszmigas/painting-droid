import { useEffect, useState } from "react";

export const useBlobUrl = (blob: Blob | null | undefined) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setSrc("");
  }, [blob]);

  return src;
};

