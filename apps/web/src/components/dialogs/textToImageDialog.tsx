import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { memo, useEffect, useState } from "react";
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
import { uuid } from "@/utils/uuid";
import { getTranslations } from "@/translations";
import { useCanvasActionDispatcher, useTextToImageModels } from "@/hooks";
import { useCommandService } from "@/contexts/commandService";
import { ImageFromBlob } from "../image/imageFromBlob";
import { type CustomField, getDefaultValues } from "@/utils/customFieldsSchema";
import { OptionSizeCustomField } from "../custom-fields/optionSizeCustomField";
import { StringCustomField } from "../custom-fields/stringCustomField";
import type { TextToImageModelInfo } from "@/hooks/useTextToImageModels";
import { OptionNumberCustomField } from "../custom-fields/optionNumberCustomField";
import { scaleRectangleToFitParent } from "@/utils/geometry";

const translations = getTranslations();
const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, { message: "Prompt must be at least 10 characters." }),
  modelId: z.string(),
  modelOptionsValues: z.record(z.string(), z.unknown()),
});

const getDefaultModelOptions = (
  models: TextToImageModelInfo[],
  modelId: string
) => {
  const model = models.find((model) => model.id === modelId);
  return (model?.definition.textToImage.optionsSchema || {}) as Record<
    string,
    CustomField
  >;
};

const getDefaultModelOptionsValues = (
  models: TextToImageModelInfo[],
  modelId: string
) =>
  getDefaultValues(getDefaultModelOptions(models, modelId)) as Record<
    string,
    unknown
  >;

const defaultSize = { width: 320, height: 320 };

export const TextToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const { executeCommand } = useCommandService();
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const models = useTextToImageModels();

  //there will be always at least one text to image model
  const defaultModelId = models[0].id;

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
  const [image, setImage] = useState<Blob | null>(null);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const optionsValues = form.watch("modelOptionsValues");
    const modelDefinition = models.find(
      (model) => model.id === data.modelId
    )!.definition;

    modelDefinition.textToImage
      .execute(modelId, data.prompt, optionsValues)
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
    const currentSize = (form.watch("modelOptionsValues.size") ??
      defaultSize) as Size;
    await canvasActionDispatcher.execute("drawOverlayShape", {
      display: translations.models.textToImage.name,
      overlayShape: {
        id: uuid(),
        type: "rectangle",
        boundingBox: {
          x: 0,
          y: 0,
          width: currentSize.width,
          height: currentSize.height,
        },
        captured: {
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

  // update default model options when model changes
  useEffect(() => {
    form.setValue(
      "modelOptionsValues",
      getDefaultModelOptionsValues(models, modelId)
    );
  }, [modelId, form, models]);

  const error = form.formState.errors.root?.message;

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{translations.models.textToImage.name}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-big sm:flex-row"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex basis-0 flex-col items-center justify-center gap-big size-full">
            <div
              style={{
                width: `${imageSize.width * scale}px`,
                height: `${imageSize.height * scale}px`,
              }}
              className=" border-primary border-2 border-dashed object-contain box-content"
            >
              {image && (
                <ImageFromBlob
                  className="size-full object-contain"
                  blob={image}
                  alt=""
                />
              )}
            </div>
          </div>
          <div className="flex flex-grow justify-between flex-col gap-big min-w-64">
            <div className="flex flex-col gap-big">
              <FormField
                control={form.control}
                name="modelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.models.name}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-big">
                {Object.entries(form.watch("modelOptionsValues"))
                  .filter(([key]) => modelOptions[key])
                  .map(([key, value]) => {
                    const option = modelOptions[key];
                    if (option.type === "string") {
                      return (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`modelOptionsValues.${key}`}
                          render={({ field }) => (
                            <StringCustomField
                              customField={modelOptions[key]}
                              value={value as string}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      );
                    }
                    if (option.type === "option-size") {
                      return (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`modelOptionsValues.${key}`}
                          render={({ field }) => {
                            return (
                              <FormItem className="">
                                <OptionSizeCustomField
                                  customField={modelOptions[key]}
                                  value={value as Size}
                                  onChange={field.onChange}
                                />
                              </FormItem>
                            );
                          }}
                        />
                      );
                    }
                    if (option.type === "option-number") {
                      return (
                        <FormField
                          key={key}
                          control={form.control}
                          name={`modelOptionsValues.${key}`}
                          render={({ field }) => {
                            return (
                              <FormItem className="">
                                <OptionNumberCustomField
                                  customField={modelOptions[key]}
                                  value={value as number}
                                  onChange={field.onChange}
                                />
                              </FormItem>
                            );
                          }}
                        />
                      );
                    }
                  })}
              </div>
              <FormMessage className={"text-destructive"}>{error}</FormMessage>
            </div>
            <div className="gap-medium flex flex-row justify-end">
              <Button type="submit" variant="secondary" disabled={isGenerating}>
                {image
                  ? translations.general.regenerate
                  : translations.general.generate}
                {isGenerating ? (
                  <Icon
                    className="ml-2 animate-spin"
                    type="loader"
                    size="small"
                  />
                ) : (
                  <Icon
                    className="ml-2"
                    type={image ? "check" : "brain"}
                    size="small"
                  />
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

