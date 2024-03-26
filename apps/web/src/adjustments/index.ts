import type { IconType } from "@/components/icons/icon";
import { getTranslations } from "@/translations";

const translations = getTranslations().adjustments;

type AdjustmentMetadata = {
  name: string;
  icon: IconType;
  settings: Record<string, unknown>;
};

const grayscale: AdjustmentMetadata = {
  name: translations.grayscale.name,
  icon: "brush",
  settings: {},
};

const sepia: AdjustmentMetadata = {
  name: translations.sepia.name,
  icon: "brush",
  settings: {},
};

export const adjustmentsMetadata = {
  grayscale,
  sepia,
} as const;

export type AdjustmentId = keyof typeof adjustmentsMetadata;

export const getDefaultAdjustmentsSettings = (adjustmentId: AdjustmentId) => {
  const result: Record<string, unknown> = {};
  Object.entries(adjustmentsMetadata[adjustmentId].settings).forEach(() => {}); //todo
  return result;
};

