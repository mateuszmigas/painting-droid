import type { Size } from "@/utils/common";
import { cn } from "@/utils/css";

export const ImageFit = (props: {
  src: string;
  containerSize: Size;
  containerScale?: "contain" | "cover";
  containerClassName?: string;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  originalImageSize?: Size;
  overlayNodeRenderer?: () => React.ReactNode;
}) => {
  const {
    containerSize,
    src,
    containerClassName,
    imageClassName,
    imageStyle = {},
    originalImageSize,
    overlayNodeRenderer: overlayNode,
    containerScale: scale = "contain",
  } = props;
  return (
    <div
      style={
        scale === "cover"
          ? {}
          : {
              width: containerSize.width,
              height: containerSize.height,
            }
      }
      className={cn("flex justify-center items-center", containerClassName)}
    >
      <img
        className={cn("object-contain", imageClassName)}
        src={src}
        width={originalImageSize?.width}
        height={originalImageSize?.height}
        style={{
          ...imageStyle,
          maxWidth: containerSize.width,
          maxHeight: containerSize.height,
        }}
        alt=""
      />
      {overlayNode?.()}
    </div>
  );
};

