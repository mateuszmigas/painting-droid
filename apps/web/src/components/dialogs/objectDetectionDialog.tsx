import type {
  ObjectDetectionModel,
  ObjectDetectionResult,
} from "@/models/types/objectDetectionModel";
import { getTranslations } from "@/translations";
import type { ImageCompressedData } from "@/utils/imageData";
import { memo, useState } from "react";
import { Icon } from "../icons/icon";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
import { useSettingsStore, useWorkspacesStore } from "@/store";
import {
  activeWorkspaceActiveLayerSelector,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";
import { useBlobUrl, useCanvasActionDispatcher } from "@/hooks";
import { ImageProcessor } from "@/utils/imageProcessor";
import {
  modelDefinitions,
  objectDetectionModelTypes,
} from "@/models/definitions";
import { markerColors } from "@/contants";

const getColor = (index: number) => markerColors[index % markerColors.length];

const translations = getTranslations();

const applyResultToImage = (
  imageData: ImageCompressedData,
  result: ObjectDetectionResult
) => {
  return ImageProcessor.fromCompressedData(imageData)
    .useContext(async (context) => {
      context.lineWidth = 4;

      for (let i = result.length - 1; i >= 0; i--) {
        const item = result[i];
        context.strokeStyle = getColor(i);
        context.strokeRect(
          item.box.x,
          item.box.y,
          item.box.width,
          item.box.height
        );
        context.font = "16px Arial";
        context.fillStyle = getColor(i);
        context.fillText(item.label, item.box.x + 5, item.box.y + 16);
      }
    })
    .toCompressedData();
};

export const ObjectDetectionDialog = memo((props: { close: () => void }) => {
  const { close } = props;

  const activeLayer = useWorkspacesStore((state) =>
    activeWorkspaceActiveLayerSelector(state)
  );
  const size = useWorkspacesStore(
    (state) => activeWorkspaceCanvasDataSelector(state).size
  );
  const userModels = useSettingsStore((state) => state.userModels);
  const allModels = userModels
    .filter((model) => objectDetectionModelTypes.includes(model.type))
    .map((model) => ({
      data: model,
      definition: modelDefinitions.find(
        (md) => md.type === model.type
      ) as ObjectDetectionModel,
    }));
  console.log(userModels);
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const [selectedModelId, setSelectedModelId] = useState(allModels[0].data.id);
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
      const modelDefinition = allModels.find(
        (model) => model.data.id === selectedModelId
      )!.definition;

      const result = await modelDefinition.detectObjects.execute(
        { data: activeLayer.data!, ...size },
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
      display: translations.models.objectDetection.name,
    });
    close();
  };

  const imageDataUrl = useBlobUrl(imageData);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{translations.models.objectDetection.name}</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-big sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          process();
        }}
      >
        <ImageFit
          containerClassName="border-primary border-2 border-dashed box-content self-center"
          imageClassName="alpha-background"
          containerSize={{ width: 320, height: 320 }}
          src={imageDataUrl}
        />

        <div className="flex flex-col gap-big justify-between min-w-64">
          <div className="flex flex-col gap-medium">
            <Label>Model</Label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allModels.map((model) => (
                  <SelectItem key={model.data.id} value={model.data.id}>
                    {model.data.display}
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

