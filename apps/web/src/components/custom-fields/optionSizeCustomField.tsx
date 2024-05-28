import type { Size } from "@/utils/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { CustomField } from "@/utils/customFieldsSchema";
import { Label } from "../ui/label";

const sizeToId = (size: Size) => `${size.width}x${size.height}`;
const sizeFromId = (id: string) => {
  const [width, height] = id.split("x").map(Number);
  return { width, height };
};

export const OptionSizeCustomField = (props: {
  customField: CustomField;
  value: Size;
  onChange: (value: Size) => void;
}) => {
  const { customField, value, onChange } = props;
  const field = customField as Extract<CustomField, { type: "option-size" }>;
  return (
    <>
      <Label>{field.name}</Label>
      <Select
        onValueChange={(value) => onChange(sizeFromId(value))}
        value={sizeToId(value as Size)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map(({ label, value }) => {
            const id = sizeToId(value);
            return (
              <SelectItem key={id} value={id}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};
