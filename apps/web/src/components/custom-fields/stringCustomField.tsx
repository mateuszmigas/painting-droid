import type { CustomField } from "@/utils/customFieldsSchema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const StringCustomField = (props: {
  customField: CustomField;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { customField, value, onChange } = props;
  const field = customField as Extract<CustomField, { type: "option-size" }>;
  return (
    <>
      <Label>{field.name}</Label>
      <Input onChange={(e) => onChange(e.target.value)} value={value} />
    </>
  );
};
