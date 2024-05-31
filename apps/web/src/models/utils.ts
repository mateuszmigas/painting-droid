import { getTranslations } from "@/translations";

const translations = getTranslations().models;

export const handleHttpError = (status: number) => {
  if (status !== 200) {
    throw new Error(
      translations.errors[status as keyof typeof translations.errors] ||
        translations.errors.default
    );
  }
};

/*
  this placeholder will be replaced with the actual API key
  from safe storage when the request is made
*/
export const createApiKeyPlaceholder = (modelId: string) => {
  return `APIKEY(${modelId})`;
};

