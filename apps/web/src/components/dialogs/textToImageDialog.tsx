import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { memo, useEffect, useMemo, useState } from "react";
import { scaleRectangleToFitParent, type Size } from "@/utils/common";
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
import { useCanvasActionDispatcher, useStableCallback } from "@/hooks";
import { useCommandService } from "@/contexts/commandService";
import { ImageFromBlob } from "../image/imageFromBlob";
import { useSettingsStore } from "@/store";
import { modelDefinitions, textToImageModelTypes } from "@/models/definitions";
import type {
  TextToImageModel,
  TextToImageOption,
} from "@/models/types/textToImageModel";

const translations = getTranslations();
const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  modelId: z.string(),
  modelOptions: z.record(z.string(), z.unknown()),
});

const sizeToId = (size: Size) => `${size.width}x${size.height}`;
const sizeFromId = (id: string) => {
  const [width, height] = id.split("x").map(Number);
  return { width, height };
};
const defaultSize = { width: 320, height: 320 };

export const TextToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { executeCommand } = useCommandService();
  const userModels = useSettingsStore((state) => state.userModels);

  const allModels = useMemo(() => {
    return userModels
      .filter((model) => textToImageModelTypes.includes(model.type))
      .map((model) => {
        const definition = modelDefinitions.find(
          (modelDefinition) => modelDefinition.type === model.type
        ) as TextToImageModel;
        return {
          id: model.id,
          display: model.display.trim()
            ? model.display
            : definition.defaultName,
          definition,
        };
      });
  }, [userModels]);
  const defaultModelId = allModels[0].id;

  const getDefaultModelOptions = useStableCallback((modelId: string) => {
    const model = allModels.find((model) => model.id === modelId);
    return model?.definition.textToImage.options || {};
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "a cat with a nice hat",
      modelId: defaultModelId,
      modelOptions: getDefaultModelOptions(defaultModelId),
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);

  const modelId = form.watch("modelId");

  // biome-ignore lint/correctness/useExhaustiveDependencies: I know better
  useEffect(() => {
    if (modelId) {
      form.setValue("modelOptions", getDefaultModelOptions(modelId));
    }
  }, [modelId]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const options = form.watch("modelOptions");
    // const size = sizeFromId(form.watch("sizeId"));
    const modelDefinition = allModels.find(
      (model) => model.id === data.modelId
    )!.definition;

    console.log("options", options);

    // modelDefinition.textToImage
    //   .execute(modelId, data.prompt, options)
    //   .then((img) => {
    //     setImage(img.data);
    //     setIsGenerating(false);
    //   })
    //   .catch((err) => {
    //     form.setError("prompt", { message: err.toString() });
    //     setIsGenerating(false);
    //   });
  };

  const apply = async () => {
    if (image === null) {
      close();
      return;
    }

    await executeCommand("selectTool", { toolId: "rectangleSelect" });
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

  const options = form.watch("modelOptions") as Record<
    string,
    TextToImageOption
  >;

  const currentSize = (options?.size?.default ?? defaultSize) as Size;
  console.log("currentSize", currentSize);
  const { scale } = scaleRectangleToFitParent(
    { x: 0, y: 0, ...currentSize },
    defaultSize,
    1
  );

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
                width: `${currentSize.width * scale}px`,
                height: `${currentSize.height * scale}px`,
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
          <div className="flex flex-grow flex-col gap-big justify-between min-w-64">
            <div className="w-full flex flex-col gap-big mb-big">
              <div className="w-full flex flex-row gap-big">
                <FormField
                  control={form.control}
                  name="modelId"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]_ w-[50%]_">
                      <FormLabel>Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="truncate max-w-[300px]">
                                {model.display}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {Object.entries(options).map(([key, option]) => {
                  if (option.type === "string") {
                    return (
                      <FormField
                        control={form.control}
                        name={`modelOptions.${key}`}
                        render={({ field }) => (
                          //     <FormLabel>Prompt</FormLabel>
                          // <FormControl>
                          //   <Input {...field} />
                          // </FormControl>
                          // <FormMessage />
                          <FormItem className="">
                            <FormLabel>{option.name}</FormLabel>
                            <FormControl>
                              {/* <Input {...field} onChange={} /> */}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }
                  if (option.type === "select") {
                    return (
                      <FormField
                        control={form.control}
                        name={`modelOptions.${key}`}
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel>{option.name}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value as never}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* {availableSizes.map((size) => {
                            const id = sizeToId(size);
                            return (
                              <SelectItem key={id} value={id}>
                                {size.width}x{size.height}
                              </SelectItem>
                            );
                          })} */}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }
                })}
              </div>
              <div className="w-full flex flex-row gap-big items-end">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="gap-medium flex flex-row justify-end">
              <Button type="submit" variant="secondary" disabled={isGenerating}>
                {image ? "Regenerate" : "Generate"}
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
                Apply
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});

