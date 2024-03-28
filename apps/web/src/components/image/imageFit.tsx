import type { Size } from "@/utils/common";
import { cn } from "@/utils/css";

export const ImageFit = (props: {
  src: string;
  containerSize: Size;
  containerClassName?: string;
  imageClassName?: string;
}) => {
  const { containerSize, src, containerClassName, imageClassName } = props;
  return (
    <div
      style={{ width: containerSize.width, height: containerSize.height }}
      className={cn("flex justify-center items-center", containerClassName)}
    >
      <img
        className={cn("object-contain", imageClassName)}
        src={src}
        style={{
          maxWidth: containerSize.width,
          maxHeight: containerSize.height,
        }}
        alt=""
      />
    </div>
  );
};

