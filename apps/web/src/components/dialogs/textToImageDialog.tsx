import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { memo, useState } from "react";
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
import { useCanvasActionDispatcher } from "@/hooks";
import { useCommandService } from "@/contexts/commandService";
import { ImageFromBlob } from "../image/imageFromBlob";
import { useSettingsStore } from "@/store";
import { modelDefinitions, textToImageModelTypes } from "@/models/definitions";
import type { TextToImageModel } from "@/models/types/textToImageModel";

const translations = getTranslations();

const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  modelId: z.string(),
  sizeId: z.string(),
});

const sizeToId = (size: Size) => `${size.width}x${size.height}`;
const sizeFromId = (id: string) => {
  const [width, height] = id.split("x").map(Number);
  return { width, height };
};

export const TextToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { executeCommand } = useCommandService();
  const userModels = useSettingsStore((state) => state.userModels);
  const allModels = userModels
    .filter((model) => textToImageModelTypes.includes(model.type))
    .map((model) => {
      const definition = modelDefinitions.find(
        (modelDefinition) => modelDefinition.type === model.type
      ) as TextToImageModel;
      return {
        id: model.id,
        display: model.display.trim() ? model.display : definition.defaultName,
        definition,
      };
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "a cat with a nice hat",
      modelId: allModels[0].id,
      sizeId: sizeToId(allModels[0].definition.textToImage.sizes[0]),
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);
  const availableSizes =
    allModels.find((model) => model.id === form.watch("modelId"))?.definition
      .textToImage.sizes || [];

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const size = sizeFromId(form.watch("sizeId"));
    const modelDefinition = allModels.find(
      (model) => model.id === data.modelId
    )!.definition;

    modelDefinition.textToImage
      .execute(data.prompt, size)
      .then((img) => {
        setImage(img.data);
        setIsGenerating(false);
      })
      .catch((err) => {
        form.setError("prompt", { message: err.toString() });
        setIsGenerating(false);
      });
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

  const currentSize = sizeFromId(form.watch("sizeId"));
  const { scale } = scaleRectangleToFitParent(
    { x: 0, y: 0, ...currentSize },
    { width: 320, height: 320 },
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
                    <FormItem className="min-w-[200px] w-[50%]">
                      <FormLabel>Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.display}
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
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem className="min-w-[120px] w-[50%]">
                      <FormLabel>Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value as never}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSizes.map((size) => {
                            const id = sizeToId(size);
                            return (
                              <SelectItem key={id} value={id}>
                                {size.width}x{size.height}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
