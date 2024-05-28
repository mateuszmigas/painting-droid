import type { Size } from "@/utils/common";
import { OptionNumberCustomField } from "./optionNumberCustomField";
import { OptionSizeCustomField } from "./optionSizeCustomField";
import { StringCustomField } from "./stringCustomField";
import { getDefaultValues, type CustomField } from "@/utils/customFieldsSchema";

export const CustomFieldArray = (props: {
  schema: Record<string, CustomField>;
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  columns?: number;
}) => {
  const { onChange, schema, columns = 1 } = props;
  const values = { ...getDefaultValues(props.schema), ...props.values };
  return Object.entries(values).map(([key, value]) => {
    const field = schema[key];
    const getField = () => {
      if (field.type === "string") {
        return (
          <StringCustomField
            customField={schema[key]}
            value={value as string}
            onChange={(value) => onChange(key, value)}
          />
        );
      }
      if (field.type === "option-size") {
        return (
          <OptionSizeCustomField
            customField={schema[key]}
            value={value as Size}
            onChange={(value) => onChange(key, value)}
          />
        );
      }
      if (field.type === "option-number") {
        return (
          <OptionNumberCustomField
            customField={schema[key]}
            value={value as number}
            onChange={(value) => onChange(key, value)}
          />
        );
      }
      return null;
    };

    return (
      <div
        key={key}
        className={`col-span-${Math.min(field?.style?.columns ?? 1, columns)}`}
      >
        {getField()}
      </div>
    );
  });
};
