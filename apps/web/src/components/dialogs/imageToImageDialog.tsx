import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { memo, useState } from "react";
import type { Size } from "@/utils/common";
import { Input } from "../ui/input";
import { Icon } from "../icons/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getTranslations } from "@/translations";
import {
  useBlobUrl,
  useCanvasActionDispatcher,
  useImageToImageModels,
} from "@/hooks";
import { useCommandService } from "@/contexts/commandService";
import { ImageFromBlob } from "../image/imageFromBlob";
import { type CustomField, getDefaultValues } from "@/utils/customFieldsSchema";
import type { ImageToImageModelInfo } from "@/hooks/useImageToImageModels";
import { scaleRectangleToFitParent } from "@/utils/geometry";
import { uuid } from "@/utils/uuid";
import { CustomFieldArray } from "../custom-fields/customFieldArray";
import { useWorkspacesStore } from "@/store";
import { activeWorkspaceActiveLayerSelector } from "@/store/workspacesStore";
import type { ImageCompressedData } from "@/utils/imageData";
import { ImageFit } from "../image/imageFit";

const translations = getTranslations();
const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, { message: "Prompt must be at least 10 characters." }),
  modelId: z.string(),
  modelOptionsValues: z.record(z.string(), z.unknown()),
});

const getDefaultModelOptions = (
  models: ImageToImageModelInfo[],
  modelId: string
) => {
  const model = models.find((model) => model.id === modelId);
  return (model?.definition.imageToImage.optionsSchema || {}) as Record<
    string,
    CustomField
  >;
};

const getDefaultModelOptionsValues = (
  models: ImageToImageModelInfo[],
  modelId: string
) =>
  getDefaultValues(getDefaultModelOptions(models, modelId)) as Record<
    string,
    unknown
  >;

const defaultSize = { width: 320, height: 320 };

export const ImageToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const { executeCommand } = useCommandService();
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useImageToImageModels();
  const activeLayer = useWorkspacesStore((state) =>
    activeWorkspaceActiveLayerSelector(state)
  );
  const defaultModelId = models[0]?.id;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "a cat with a nice hat",
      modelId: defaultModelId,
      modelOptionsValues: getDefaultModelOptionsValues(models, defaultModelId),
    },
  });
  const imageSize = (form.watch("modelOptionsValues.size") ??
    defaultSize) as Size;
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageData, setImageData] = useState<ImageCompressedData | null>(
    activeLayer.data
  );

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const optionsValues = form.watch("modelOptionsValues");
    const { definition, config } = models.find(
      (model) => model.id === data.modelId
    )!;

    definition.imageToImage
      .execute(modelId, data.prompt, imageData!, optionsValues, config)
      .then((img) => {
        setImageData(img.data);
        setIsGenerating(false);
      })
      .catch((err) => {
        form.setError("root", { message: err.toString() });
        setIsGenerating(false);
      });
  };

  const apply = async () => {
    if (image === null) {
      close();
      return;
    }

    await executeCommand("selectTool", { toolId: "rectangleSelect" });
    const currentSize = (form.watch("modelOptionsValues.size") ??
      defaultSize) as Size;
    await canvasActionDispatcher.execute("addShape", {
      display: translations.models.imageToImage.name,
      shape: {
        id: uuid(),
        type: "generated-image",
        boundingBox: { ...currentSize, x: 0, y: 0 },
        capturedArea: {
          box: { x: 0, y: 0, width: 0, height: 0 },
          data: image,
        },
      },
    });
    close();
  };

  const modelId = form.watch("modelId");
  const modelOptions = getDefaultModelOptions(models, modelId);
  const { scale } = scaleRectangleToFitParent(
    { x: 0, y: 0, ...imageSize },
    defaultSize,
    1
  );

  const error = form.formState.errors.root?.message;

  //todo: remove after release
  const isLocked =
    models.find((model) => model.id === modelId)?.definition?.type === "demo";

  const imageDataUrl = useBlobUrl(imageData);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{translations.models.imageToImage.name}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-big sm:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ImageFit
            containerClassName="border box-content self-center"
            imageClassName="alpha-background"
            containerSize={{ width: 320, height: 320 }}
            src={imageDataUrl}
          />
          <div className="flex flex-grow justify-between flex-col gap-big min-w-64">
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
                        form.setValue(
                          "modelOptionsValues",
                          getDefaultModelOptionsValues(models, value)
                        );
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="truncate max-w-[300px]">
                              {model.display}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input {...field} disabled={isLocked} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLocked && (
                <FormMessage className={"text-muted-foreground"}>
                  {"Demo model prompt cannot be edited"}
                </FormMessage>
              )}
              <div className="flex flex-col gap-big">
                <CustomFieldArray
                  schema={modelOptions}
                  values={form.watch("modelOptionsValues")}
                  onChange={(key, value) =>
                    form.setValue(`modelOptionsValues.${key}`, value)
                  }
                />
              </div>
              <FormMessage className={"text-destructive"}>{error}</FormMessage>
            </div>
            <div className="gap-medium flex flex-row justify-end">
              <Button type="submit" variant="secondary" disabled={isGenerating}>
                {translations.general.generate}
                {isGenerating ? (
                  <Icon
                    className="ml-2 animate-spin"
                    type="loader"
                    size="small"
                  />
                ) : (
                  <Icon className="ml-2" type={"check"} size="small" />
                )}
              </Button>
              {/* <Button type="button" onClick={apply} disabled={!image}>
                {translations.general.apply}
              </Button> */}
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});

