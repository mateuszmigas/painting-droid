import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCommandService } from "@/contexts/commandService";
import { useCanvasActionDispatcher, useTextToImageModels } from "@/hooks";
import type { TextToImageModelInfo } from "@/hooks/useTextToImageModels";
import { getTranslations } from "@/translations";
import type { Size } from "@/utils/common";
import { type CustomField, getDefaultValues } from "@/utils/customFieldsSchema";
import { scaleRectangleToFitParent } from "@/utils/geometry";
import type { ImageCompressedData } from "@/utils/imageData";
import { uuid } from "@/utils/uuid";
import { CustomFieldArray } from "../custom-fields/customFieldArray";
import { Icon } from "../icons/icon";
import { ImageFromBlob } from "../image/imageFromBlob";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.textToImage;
const FormSchema = z.object({
  prompt: z.string().min(10, { message: "Prompt must be at least 10 characters." }),
  modelId: z.string(),
  modelOptionsValues: z.record(z.string(), z.unknown()),
});

const getDefaultModelOptions = (models: TextToImageModelInfo[], modelId: string) => {
  const model = models.find((model) => model.id === modelId);
  return (model?.definition.textToImage.optionsSchema || {}) as Record<string, CustomField>;
};

const getDefaultModelOptionsValues = (models: TextToImageModelInfo[], modelId: string) =>
  getDefaultValues(getDefaultModelOptions(models, modelId)) as Record<string, unknown>;

const defaultSize = { width: 320, height: 320 };

export const TextToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const { executeCommand } = useCommandService();
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useTextToImageModels();

  const defaultModelId = models[0]?.id;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: dialogTranslations.defaultPrompt,
      modelId: defaultModelId,
      modelOptionsValues: getDefaultModelOptionsValues(models, defaultModelId),
    },
  });
  const imageSize = (form.watch("modelOptionsValues.size") ?? defaultSize) as Size;
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<ImageCompressedData | null>(null);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const optionsValues = form.watch("modelOptionsValues");
    const { definition, config } = models.find((model) => model.id === data.modelId)!;

    definition.textToImage
      .execute(modelId, data.prompt, optionsValues, config)
      .then((img) => {
        setImage(img.data);
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
    const currentSize = (form.watch("modelOptionsValues.size") ?? defaultSize) as Size;
    await canvasActionDispatcher.execute("addShape", {
      display: translations.models.textToImage.name,
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
  const { scale } = scaleRectangleToFitParent({ x: 0, y: 0, ...imageSize }, defaultSize, 1);

  const error = form.formState.errors.root?.message;

  //todo: remove after release
  const isLocked = models.find((model) => model.id === modelId)?.definition?.type === "demo";

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form className="flex flex-col gap-big sm:flex-row" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex basis-0 flex-col items-center justify-center gap-big size-full">
            <div
              style={{
                width: `${imageSize.width * scale}px`,
                height: `${imageSize.height * scale}px`,
              }}
              className="border object-contain box-content"
            >
              {image && <ImageFromBlob className="size-full object-contain" blob={image} alt="" />}
            </div>
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
                          <SelectValue />
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
                <FormMessage className={"text-muted-foreground"}>{"Demo model prompt cannot be edited"}</FormMessage>
              )}
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
              <Button type="submit" variant="secondary" disabled={isGenerating}>
                {image ? translations.general.regenerate : translations.general.generate}
                {isGenerating ? (
                  <Icon className="ml-2 animate-spin" type="loader" size="small" />
                ) : (
                  <Icon className="ml-2" type={image ? "check" : "brain"} size="small" />
                )}
              </Button>
              <Button type="button" onClick={apply} disabled={!image}>
                {translations.general.apply}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});
