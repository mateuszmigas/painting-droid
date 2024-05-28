import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { CustomField } from "@/utils/customFieldsSchema";

export const OptionNumberCustomField = (props: {
  customField: CustomField;
  value: number;
  onChange: (value: number) => void;
}) => {
  const { customField, value, onChange } = props;
  const field = customField as Extract<CustomField, { type: "option-size" }>;
  return (
    <>
      <Label>{field.name}</Label>
      <Select
        onValueChange={(value) => onChange(Number(value))}
        value={value.toString()}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map(({ label, value }) => {
            const id = value.toString();
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
