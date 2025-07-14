import type { CustomField } from "@/utils/customFieldsSchema";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const OptionStringCustomField = (props: {
  customField: CustomField;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { customField, value, onChange } = props;
  const field = customField as Extract<CustomField, { type: "option-string" }>;
  return (
    <>
      <Label>{field.name}</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
