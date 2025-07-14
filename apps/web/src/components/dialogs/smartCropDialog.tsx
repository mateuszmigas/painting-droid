import { memo, useState } from "react";
import { useBlobUrl, useCanvasActionDispatcher, useObjectDetectionModels } from "@/hooks";
import type { ObjectDetectionResult } from "@/models/types/objectDetectionModel";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceActiveLayerSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { ImageCompressedData } from "@/utils/imageData";
import { Icon } from "../icons/icon";
import { ImageFit } from "../image/imageFit";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const translations = getTranslations();

export const SmartCropDialog = memo((props: { close: () => void }) => {
  const { close } = props;

  const activeLayer = useWorkspacesStore((state) => activeWorkspaceActiveLayerSelector(state));
  const size = useWorkspacesStore((state) => activeWorkspaceCanvasDataSelector(state).size);
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useObjectDetectionModels();

  //there will be always at least one text to image model
  const defaultModelId = models[0].id;
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ObjectDetectionResult[] | null | string>(null);
  const [selectedDetectionIndex, setSelectedDetectionIndex] = useState<number | null>(null);
  const selectedCrop =
    Array.isArray(result) && selectedDetectionIndex !== null ? result[selectedDetectionIndex].box : null;

  const [imageData, setImageData] = useState<ImageCompressedData | null>(activeLayer.data);

  const process = async () => {
    const originalImage = activeLayer.data;
    if (originalImage === null) {
      setResult(translations.errors.noImageData);
      return;
    }
    setResult(null);
    setSelectedDetectionIndex(null);
    setImageData(activeLayer.data);
    setIsProcessing(true);

    try {
      const { definition, config } = models.find((model) => model.id === selectedModelId)!;

      const result = await definition.detectObjects.execute(
        { data: activeLayer.data!, ...size },
        (progress, message) => {
          progress && setProgress(progress);
          progress && message && setProgressMessage(message);
        },
        {},
        config,
      );

      setResult(result);
      setSelectedDetectionIndex(result.length > 0 ? 0 : null);
    } catch {
      setResult(translations.errors.processingError);
      setSelectedDetectionIndex(null);
    } finally {
      setIsProcessing(false);
      setProgress(null);
      setProgressMessage(null);
    }
  };

  const apply = async () => {
    if (imageData === null || selectedCrop === null) {
      return;
    }
    await canvasActionDispatcher.execute("cropCanvas", {
      crop: selectedCrop,
      display: translations.models.smartCrop.name,
    });
    close();
  };

  const imageDataUrl = useBlobUrl(imageData);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{translations.models.smartCrop.name}</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-big sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          process();
        }}
      >
        <ImageFit
          containerClassName="relative border box-content self-center"
          imageClassName="alpha-background"
          containerSize={{ width: 320, height: 320 }}
          src={imageDataUrl}
          overlayNodeRenderer={() => {
            if (selectedCrop === null) {
              return null;
            }
            return (
              <div
                style={{
                  width: `${(100 * selectedCrop.width) / size.width}%`,
                  height: `${(100 * selectedCrop.height) / size.height}%`,
                  left: `${(100 * selectedCrop.x) / size.width}%`,
                  top: `${(100 * selectedCrop.y) / size.height}%`,
                }}
                className="absolute border-2 border-dashed border-primary"
              />
            );
          }}
        />

        <div className="flex flex-col gap-big justify-between min-w-64">
          <div className="flex flex-col gap-medium">
            <Label>{translations.models.name}</Label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.display}
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
                <Select
                  value={selectedDetectionIndex?.toString() ?? ""}
                  onValueChange={(value) => setSelectedDetectionIndex(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {result.map((model, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: checked
                      <SelectItem key={index} value={index.toString()}>
                        <div className="flex flex-row items-center gap-medium">
                          <div>{model.score.toFixed(2)}</div>
                          <div>{model.label}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-xs">{translations.models.labelObjects.result.noObjects}</div>
              )}
            </div>
          ) : (
            progress !== null && (
              <div className="flex flex-col gap-medium flex-1">
                <Label>{translations.general.loading}</Label>
                <Progress value={progress} />
                {progressMessage && <div className="text-xs">{progressMessage}</div>}
              </div>
            )
          )}
          <div className="gap-medium flex flex-row justify-end">
            <Button type="submit" variant="secondary" disabled={isProcessing}>
              {translations.general.process}
              {isProcessing ? (
                <Icon className="ml-2 animate-spin" type="loader" size="small" />
              ) : (
                <Icon className="ml-2" type={result !== null ? "check" : "brain"} size="small" />
              )}
            </Button>
            <Button type="button" onClick={apply} disabled={!(Array.isArray(result) && result.length > 0)}>
              {translations.general.apply}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
});
