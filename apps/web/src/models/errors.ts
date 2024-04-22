import { getTranslations } from "@/translations";

const translations = getTranslations().models;

export const handleHttpError = (status: number) => {
  translations.errors[429];
  if (status !== 200) {
    throw new Error(
      translations.errors[status as keyof typeof translations.errors] ||
        translations.errors.default
    );
  }
};

