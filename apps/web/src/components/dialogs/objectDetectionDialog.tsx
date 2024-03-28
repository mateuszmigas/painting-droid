import type { ObjectDetectionResult } from "@/models/object-detection/objectDetectionModel";
import { getTranslations } from "@/translations";
import {
  canvasContextFromCompressed,
  createCompressedFromContext,
  type ImageCompressedData,
} from "@/utils/imageData";
import { memo, useState } from "react";
import { Icon } from "../icons/icon";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { objectDetectionModels } from "@/models/object-detection";
import { ImageFit } from "../image/imageFit";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceActiveLayerSelector } from "@/store/workspacesStore";
import { useCanvasActionDispatcher } from "@/hooks";

const colors = [
  "#D04848",
  "#F3B95F",
  "#6895D2",
  "#0802A3",
  "#007F73",
  "#4CCD99",
  "#FFF455",
];

const getColor = (index: number) => colors[index % colors.length];

const translations = getTranslations();

const models = Object.entries(objectDetectionModels).map(([key, value]) => ({
  value: key,
  label: value.name,
}));

const applyResultToImage = async (
  image: ImageCompressedData,
  result: ObjectDetectionResult
) => {
  const context = await canvasContextFromCompressed(image);
  context.lineWidth = 4;

  for (let i = result.length - 1; i >= 0; i--) {
    const item = result[i];
    context.strokeStyle = getColor(i);
    context.strokeRect(item.box.x, item.box.y, item.box.width, item.box.height);
    context.font = "16px Arial";
    context.fillStyle = getColor(i);
    context.fillText(item.label, item.box.x + 5, item.box.y + 16);
  }

  return createCompressedFromContext(context);
};

export const ObjectDetectionDialog = memo((props: { close: () => void }) => {
  const { close } = props;

  const activeLayer = useWorkspacesStore((state) =>
    activeWorkspaceActiveLayerSelector(state)
  );
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const [selectedModel, setSelectedModel] = useState(models[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ObjectDetectionResult | null | string>(
    null
  );
  const [imageData, setImageData] = useState<ImageCompressedData | null>(
    activeLayer.data
  );

  const process = async () => {
    const originalImage = activeLayer.data;
    if (originalImage === null) {
      setResult(translations.errors.noImageData);
      return;
    }
    setResult(null);
    setImageData(activeLayer.data);
    setIsProcessing(true);

    try {
      const model =
        objectDetectionModels[
          selectedModel as keyof typeof objectDetectionModels
        ];
      const result = await model.execute(
        activeLayer.data!,
        (progress, message) => {
          progress && setProgress(progress);
          progress && message && setProgressMessage(message);
        }
      );

      setResult(result);
      if (result.length > 0) {
        setImageData(await applyResultToImage(originalImage, result));
      }
    } catch (error) {
      console.error(error);
      setResult(translations.errors.processingError);
    } finally {
      setIsProcessing(false);
      setProgress(null);
      setProgressMessage(null);
    }
  };

  const apply = async () => {
    if (imageData === null) {
      return;
    }
    await canvasActionDispatcher.execute("updateLayerData", {
      data: imageData,
      layerId: activeLayer.id,
      icon: "brain",
      source: translations.models.objectDetection.name,
    });
    close();
  };

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogTitle>{translations.models.objectDetection.name}</DialogTitle>
      <form
        className="flex flex-col gap-big sm:flex-row "
        onSubmit={(e) => {
          e.preventDefault();
          process();
        }}
      >
        <ImageFit
          containerClassName="border-primary border-2 border-dashed box-content self-center"
          imageClassName="alpha-background"
          containerSize={{ width: 320, height: 320 }}
          src={imageData?.data ?? ""}
        />

        <div className="flex flex-col gap-big justify-between min-w-64">
          <div className="flex flex-col gap-medium">
            <Label>Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {result !== null ? (
            <div className="flex flex-col gap-medium flex-1">
              <Label>{translations.general.result}</Label>
              {typeof result === "string" ? (
                <div className="text-destructive text-xs">{result}</div>
              ) : result.length > 0 ? (
                <div className="rounded-md min-h-0 flex-1 border overflow-auto max-h-[176px] px-small py-0.5">
                  {result?.map((r, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="flex flex-row justify-between gap-small items-center"
                    >
                      <div
                        style={{ backgroundColor: getColor(index) }}
                        className="w-5 h-5 rounded-sm"
                      />
                      <div className="text-left flex-1">{r.label}</div>
                      <div>{r.score.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs">
                  {translations.models.objectDetection.result.noObjects}
                </div>
              )}
            </div>
          ) : (
            progress !== null && (
              <div className="flex flex-col gap-medium flex-1">
                <Label>{translations.general.loading}</Label>
                <Progress value={progress} />
                {progressMessage && (
                  <div className="text-xs">{progressMessage}</div>
                )}
              </div>
            )
          )}
          <div className="gap-medium flex flex-row justify-end">
            <Button type="submit" variant="secondary" disabled={isProcessing}>
              {translations.general.process}
              {isProcessing ? (
                <Icon
                  className="ml-2 animate-spin"
                  type="loader"
                  size="small"
                />
              ) : (
                <Icon
                  className="ml-2"
                  type={result !== null ? "check" : "brain"}
                  size="small"
                />
              )}
            </Button>
            <Button
              type="button"
              onClick={apply}
              disabled={!(Array.isArray(result) && result.length > 0)}
            >
              Apply
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
});
