import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/utils/css";

export const RangeSetting = (props: {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  format: "number" | "percent";
  title: string;
  className?: string;
}) => {
  const { value, onChange, format, min, max, title, className } = props;
  return (
    <SliderPrimitive.Root
      className={cn("relative flex touch-none select-none items-center w-20", className)}
      value={[value]}
      min={min}
      max={max}
      onValueChange={(values) => onChange(values[0])}
      orientation="horizontal"
      title={title}
    >
      <SliderPrimitive.Track className="relative h-input-thin w-full grow overflow-hidden rounded-md bg-primary/75 border">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <div className="absolute pl-1.5 text-primary-foreground">{format === "percent" ? `${value}%` : value}</div>
    </SliderPrimitive.Root>
  );
};
