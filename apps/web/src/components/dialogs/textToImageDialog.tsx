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
import { textToImageModels } from "@/models/text-to-image";
import { getTranslations } from "@/translations";
import { useCanvasActionDispatcher } from "@/hooks";
import { useCommandService } from "@/contexts/commandService";
import { ImageFromBlob } from "../image/imageFromBlob";

const translations = getTranslations();

const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  model: z.string(),
  size: z.string(),
});

const demoModel = textToImageModels.demo_stability_ai;
const availableSizes = demoModel.sizes.map((size) => {
  return { id: uuid(), width: size.width, height: size.height };
});

export const TextToImageDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const { executeCommand } = useCommandService();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "a cat with a nice hat",
      model: "demo",
      size: availableSizes[0].id,
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setIsGenerating(true);

    const size = availableSizes.findIndex(
      (size) => size.id === form.watch("size")
    );

    demoModel
      .execute(data.prompt, availableSizes[size])
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
          data: {
            data: image,
            width: currentSize.width,
            height: currentSize.height,
          },
        },
      },
    });
    close();
  };

  const currentSize = availableSizes[
    availableSizes.findIndex((size) => size.id === form.watch("size"))
  ] as Size;
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
          className="flex flex-col gap-big sm:flex-row "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center justify-center gap-big size-full">
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
          <div className="flex flex-col gap-big justify-between min-w-64">
            <div className="w-full flex flex-col gap-big mb-big">
              <div className="w-full flex flex-row gap-big">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem className="w-[50%]">
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
                          <SelectItem value="demo">Demo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem className="w-[50%]">
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
                          {availableSizes.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.width}x{size.height}
                            </SelectItem>
                          ))}
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
