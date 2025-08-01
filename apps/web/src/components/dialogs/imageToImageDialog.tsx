import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCommandService } from "@/contexts/commandService";
import { useBlobUrl, useCanvasActionDispatcher, useImageToImageModels } from "@/hooks";
import type { ImageToImageModelInfo } from "@/hooks/useImageToImageModels";
import { useWorkspacesStore } from "@/store";
import { activeLayerSelector, activeWorkspaceCanvasDataSelector } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import { type CustomField, getDefaultValues } from "@/utils/customFieldsSchema";
import type { ImageCompressedData } from "@/utils/imageData";
import { uuid } from "@/utils/uuid";
import { CustomFieldArray } from "../custom-fields/customFieldArray";
import { Icon } from "../icons/icon";
import { IconButton } from "../icons/iconButton";
import { ImageFit } from "../image/imageFit";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.imageToImage;

const FormSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
  modelId: z.string().min(1, { message: "Model must be selected." }),
  modelOptionsValues: z.record(z.string(), z.unknown()),
});

const getDefaultModelOptions = (models: ImageToImageModelInfo[], modelId: string) => {
  const model = models.find((model) => model.id === modelId);
  return (model?.definition.imageToImage.optionsSchema || {}) as Record<string, CustomField>;
};

const getDefaultModelOptionsValues = (models: ImageToImageModelInfo[], modelId: string) =>
  getDefaultValues(getDefaultModelOptions(models, modelId)) as Record<string, unknown>;

export const ImageToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const { executeCommand } = useCommandService();
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useImageToImageModels();
  const canvasData = useWorkspacesStore((state) => activeWorkspaceCanvasDataSelector(state));
  const activeLayer = activeLayerSelector(canvasData);
  const defaultModelId = models[0]?.id;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: dialogTranslations.defaultPrompt,
      modelId: defaultModelId,
      modelOptionsValues: getDefaultModelOptionsValues(models, defaultModelId),
    },
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const baseImageData = activeLayer.data;
  const [generatedImageData, setGeneratedImageData] = useState<ImageCompressedData | null>(null);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsProcessing(true);

    const optionsValues = form.watch("modelOptionsValues");
    const { definition, config } = models.find((model) => model.id === data.modelId)!;

    definition.imageToImage
      .execute(modelId, data.prompt, { ...canvasData.size, data: baseImageData! }, optionsValues, config)
      .then((img) => {
        setGeneratedImageData(img.data);
        setIsProcessing(false);
      })
      .catch((err) => {
        form.setError("root", { message: err.toString() });
        setIsProcessing(false);
      });
  };

  const apply = async () => {
    await executeCommand("selectTool", { toolId: "rectangleSelect" });
    await canvasActionDispatcher.execute("addShape", {
      display: translations.models.imageToImage.name,
      shape: {
        id: uuid(),
        type: "generated-image",
        boundingBox: { ...canvasData.size, x: 0, y: 0 },
        capturedArea: {
          box: { x: 0, y: 0, width: 0, height: 0 },
          data: generatedImageData!,
        },
      },
    });
    close();
  };

  const modelId = form.watch("modelId");
  const modelOptions = getDefaultModelOptions(models, modelId);
  const error = form.formState.errors.root?.message;
  const baseImageDataUrl = useBlobUrl(baseImageData);
  const generatedImageDataUrl = useBlobUrl(generatedImageData);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form className="flex flex-col gap-big sm:flex-row" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <ImageFit
              containerClassName="relative border box-content self-center"
              imageClassName="alpha-background"
              containerSize={{ width: 320, height: 320 }}
              src={generatedImageDataUrl || baseImageDataUrl}
              overlayNodeRenderer={() => {
                return generatedImageData ? (
                  <IconButton
                    className="absolute right-1 top-1 bg-destructive hover:bg-destructive/90"
                    type="x"
                    size="small"
                    onClick={() => setGeneratedImageData(null)}
                  />
                ) : null;
              }}
            />
            {!baseImageData && (
              <FormMessage className={"text-destructive"}>{dialogTranslations.errors.layerIsEmpty}</FormMessage>
            )}
          </div>
          <div className="flex grow justify-between flex-col gap-big min-w-64">
            <div className="flex flex-col gap-big">
              <FormField
                control={form.control}
                name="modelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.models.name}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("modelId", value);
                        form.setValue("modelOptionsValues", getDefaultModelOptionsValues(models, value));
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={translations.info.noModels} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="truncate max-w-[300px]">{model.display}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.models.prompt}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-big">
                <CustomFieldArray
                  schema={modelOptions}
                  values={form.watch("modelOptionsValues")}
                  onChange={(key, value) => form.setValue(`modelOptionsValues.${key}`, value)}
                />
              </div>
              <FormMessage className={"text-destructive"}>{error}</FormMessage>
            </div>
            <div className="gap-medium flex flex-row justify-end">
              <Button type="submit" variant="secondary" disabled={isProcessing || !baseImageData}>
                {translations.general.generate}
                {isProcessing ? (
                  <Icon className="ml-2 animate-spin" type="loader" size="small" />
                ) : (
                  <Icon className="ml-2" type={"check"} size="small" />
                )}
              </Button>
              <Button type="button" onClick={apply} disabled={isProcessing || !baseImageData || !generatedImageData}>
                {translations.general.apply}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});
