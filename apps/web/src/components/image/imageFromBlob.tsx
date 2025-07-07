import { useBlobUrl } from "@/hooks";
import { memo } from "react";

type ImageFromBlobProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  blob: Blob | null | undefined;
  imgRef?: React.Ref<HTMLImageElement>;
};

export const ImageFromBlob = memo((props: ImageFromBlobProps) => {
  const { blob, imgRef, ...rest } = props;
  const src = useBlobUrl(blob);
  // biome-ignore lint/a11y/useAltText: checked
  return <img {...rest} ref={imgRef} src={src} />;
});
