import { forwardRef } from "react";
import { Input, type InputProps } from "../ui/input";

export const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "onChange"> & { onChange?: (value: number) => void }
>(({ onChange, ...props }, ref) => (
  <Input
    {...props}
    type="number"
    ref={ref}
    onChange={(e) => {
      const newValue = Number(e.target.value);
      onChange?.(Number.isNaN(newValue) ? 0 : newValue);
    }}
  />
));

