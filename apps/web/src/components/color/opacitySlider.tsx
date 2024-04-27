import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/utils/css";

export const OpacitySlider = (props: {
  value: number;
  onChange: (value: number) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) => {
  const { value, orientation = "vertical", onChange, className } = props;
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-full touch-none select-none items-center",
        className
      )}
      orientation={orientation}
      value={[value]}
      onValueChange={(values) => onChange(values[0])}
      max={100}
      step={1}
    >
      <SliderPrimitive.Track
        style={{ "--opacity-track-color": "blue" } as never}
        className="p-[7px] border relative h-full w-2.5 grow overflow-hidden rounded-full opacity-track"
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border shadow-black/50 border-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
    </SliderPrimitive.Root>
  );
};

