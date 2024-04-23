import { FormControl, FormLabel } from "../ui/form";
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
      <FormLabel>{field.name}</FormLabel>
      <Select
        onValueChange={(value) => onChange(Number(value))}
        value={value.toString()}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </FormControl>
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

