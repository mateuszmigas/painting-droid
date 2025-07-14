import type { CustomField, CustomFieldsSchema } from "@/utils/customFieldsSchema";

export type BaseModel = {
  type: string;
  url?: string;
  defaultName: string;
  predefined: boolean;
  useApiKey?: boolean;
  configSchema?: Record<string, CustomField>;
};

export const createConfigSchema = <TConfigSchema extends CustomFieldsSchema>(section: TConfigSchema) => section;
