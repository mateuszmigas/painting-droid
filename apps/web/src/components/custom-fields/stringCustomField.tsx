import { FormLabel } from "../ui/form";
import type { CustomField } from "@/utils/customFieldsSchema";
import { Input } from "../ui/input";

export const StringCustomField = (props: {
  customField: CustomField;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { customField, value, onChange } = props;
  const field = customField as Extract<CustomField, { type: "option-size" }>;
  return (
    <>
      <FormLabel>{field.name}</FormLabel>
      <Input onChange={(e) => onChange(e.target.value)} value={value} />
    </>
  );
};

