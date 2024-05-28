import type { Size } from "@/utils/common";
import { OptionNumberCustomField } from "./optionNumberCustomField";
import { OptionSizeCustomField } from "./optionSizeCustomField";
import { StringCustomField } from "./stringCustomField";
import { getDefaultValues, type CustomField } from "@/utils/customFieldsSchema";

export const CustomFieldArray = (props: {
  schema: Record<string, CustomField>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) => {
  const { onChange, schema } = props;
  const values = { ...getDefaultValues(props.schema), ...props.values };
  return Object.entries(values).map(([key, value]) => {
    const option = schema[key];
    if (option.type === "string") {
      return (
        <div key={key}>
          <StringCustomField
            customField={schema[key]}
            value={value as string}
            onChange={(value) => onChange(key, value)}
          />
        </div>
      );
    }
    if (option.type === "option-size") {
      return (
        <div key={key}>
          <OptionSizeCustomField
            customField={schema[key]}
            value={value as Size}
            onChange={(value) => onChange(key, value)}
          />
        </div>
      );
    }
    if (option.type === "option-number") {
      return (
        <div key={key}>
          <OptionNumberCustomField
            customField={schema[key]}
            value={value as number}
            onChange={(value) => onChange(key, value)}
          />
        </div>
      );
    }
  });
};
