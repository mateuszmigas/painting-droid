import { cn } from "@/utils/css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const OptionSetting = <T extends number | string>(props: {
  value: T;
  onChange: (newValue: T) => void;
  options: {
    value: T;
    label: string;
  }[];
  title: string;
  placeholder?: string;
  className?: string;
}) => {
  const { value, onChange, options, placeholder, title, className } = props;
  return (
    <Select value={value as string} onValueChange={(value) => onChange(value as T)}>
      <SelectTrigger title={title} className={cn("text-xs h-input-thin", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
