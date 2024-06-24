import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { memo, useState } from "react";
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
import { type CustomField, getDefaultValues } from "@/utils/customFieldsSchema";
import type { ImageToImageModelInfo } from "@/hooks/useImageToImageModels";
import { uuid } from "@/utils/uuid";
import { useWorkspacesStore } from "@/store";
import {
  activeLayerSelector,
  activeWorkspaceCanvasDataSelector,
} from "@/store/workspacesStore";
import type { ImageCompressedData } from "@/utils/imageData";
import { ImageFit } from "../image/imageFit";
import { IconButton } from "../icons/iconButton";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.removeBackground;

const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, { message: "Prompt must be at least 10 characters." }),
  modelId: z.string().min(1, { message: "Model must be selected." }),
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

export const RemoveBackgroundDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const { executeCommand } = useCommandService();
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useImageToImageModels();
  const canvasData = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );
  const activeLayer = activeLayerSelector(canvasData);
  const defaultModelId = models[0]?.id;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
      modelId: defaultModelId,
      modelOptionsValues: getDefaultModelOptionsValues(models, defaultModelId),
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const baseImageData = activeLayer.data;
  const [generatedImageData, setGeneratedImageData] =
    useState<ImageCompressedData | null>(null);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const optionsValues = form.watch("modelOptionsValues");
    const { definition, config } = models.find(
      (model) => model.id === data.modelId
    )!;

    definition.imageToImage
      .execute(
        modelId,
        data.prompt,
        { ...canvasData.size, data: baseImageData! },
        optionsValues,
        config
      )
      .then((img) => {
        setGeneratedImageData(img.data);
        setIsGenerating(false);
      })
      .catch((err) => {
        form.setError("root", { message: err.toString() });
        setIsGenerating(false);
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
        <form
          className="flex flex-col gap-big sm:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <div className="gap-medium flex flex-row justify-end items-end">
            <Button
              type="submit"
              variant="secondary"
              disabled={isGenerating || !baseImageData}
            >
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
            <Button
              type="button"
              onClick={apply}
              disabled={isGenerating || !baseImageData || !generatedImageData}
            >
              {translations.general.apply}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});

