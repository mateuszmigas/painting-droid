import type { Size } from "@/utils/common";
import { OptionNumberCustomField } from "./optionNumberCustomField";
import { OptionSizeCustomField } from "./optionSizeCustomField";
import { StringCustomField } from "./stringCustomField";
import { getDefaultValues, type CustomField } from "@/utils/customFieldsSchema";
import { OptionStringCustomField } from "./optionStringCustomField";

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
      if (field.type === "option-string") {
        return (
          <OptionStringCustomField
            customField={schema[key]}
            value={value as string}
            onChange={(value) => onChange(key, value)}
          />
        );
      }
      throw new Error(`Invalid field type: ${field.type}`);
    };

    const calculateColSpan = () => {
      const span = Math.min(field?.style?.columns ?? 1, columns);

      switch (span) {
        case 1:
          return "col-span-1";
        case 2:
          return "col-span-2";
        case 3:
          return "col-span-3";
        default:
          throw new Error(`Invalid column span: ${span}`);
      }
    };

    return (
      <div key={key} className={`${calculateColSpan()} space-y-form-field`}>
        {getField()}
      </div>
    );
  });
};

