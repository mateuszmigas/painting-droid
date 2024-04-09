import { getTranslations } from "@/translations";
import { memo, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { ImageFit } from "../image/imageFit";
import { useBlobUrl, useCanvasActionDispatcher } from "@/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { useForm } from "react-hook-form";
import {
  activeWorkspaceCanvasDataSelector,
  useWorkspacesStore,
} from "@/store/workspacesStore";
import { ImageProcessor } from "@/utils/imageProcessor";
import type { Size } from "@/utils/common";
import { NumberInput } from "../input/numberInput";

const dialogTranslations = getTranslations().dialogs.resizeCanvas;
const translations = getTranslations();

type FormData = {
  percentage: { width: number; height: number };
  absolute: { width: number; height: number };
};

type ResizeType = "percentage" | "absolute";

const calculateSize = (
  formData: FormData,
  canvasSize: Size,
  resizeType: ResizeType
) => {
  const { width, height } = formData[resizeType];

  if (resizeType === "percentage") {
    return {
      width: Math.round((canvasSize.width * width) / 100),
      height: Math.round((canvasSize.height * height) / 100),
    };
  }

  return { width, height };
};

const validateSize = (newSize: Size) => {
  if (newSize.width > 10000 || newSize.height > 10000) {
    return dialogTranslations.errors.tooBig;
  }
  if (newSize.width <= 0 || newSize.height <= 0) {
    return dialogTranslations.errors.tooSmall;
  }
  return null;
};

export const ResizeCanvasDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const [selectedTab, setSelectedTab] = useState<ResizeType>("percentage");
  const canvasData = useWorkspacesStore((state) =>
    activeWorkspaceCanvasDataSelector(state)
  );
  const [imageData, setImageData] = useState<Blob | null>(null);
  const imageDataUrl = useBlobUrl(imageData);
  const [isResizing, setIsResizing] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      percentage: { width: 100, height: 100 },
      absolute: { ...canvasData.size },
    },
  });

  useEffect(() => {
    ImageProcessor.fromMergedCompressed(
      canvasData.layers
        .filter((layer) => layer.data)
        .map((layer) => layer.data!),
      canvasData.size
    )
      .toCompressedData()
      .then((data) => {
        setImageData(data);
      });
  }, [canvasData.layers, canvasData.size]);

  const resize = async () => {
    setIsResizing(true);
    await canvasActionDispatcher.execute("resizeCanvas", { newSize });
    close();
  };

  const newSize = calculateSize(form.watch(), canvasData.size, selectedTab);
  const error = validateSize(newSize);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogTitle>{dialogTranslations.title}</DialogTitle>
      <Form {...form}>
        <form
          className="flex flex-col gap-big sm:flex-row relative sm:items-start items-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <ImageFit
              containerClassName="relative border box-content self-center overflow-hidden border-2 border-dashed border-primary"
              imageClassName="alpha-background"
              originalImageSize={canvasData.size}
              containerSize={{ width: 320, height: 320 }}
              containerScale="cover"
              imageStyle={{
                scale: `${newSize.width / canvasData.size.width} ${
                  newSize.height / canvasData.size.height
                }`,
                transformOrigin: "top left",
              }}
              src={imageDataUrl}
            />
            <FormMessage
              className={error ? "text-destructive" : "text-primary"}
            >
              {error ? error : dialogTranslations.printSize(newSize)}
            </FormMessage>
          </div>
          <div className="flex h-full flex-col gap-big justify-between sm:w-48">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab as (value: string) => void}
            >
              <div className="w-full flex justify-center">
                <TabsList>
                  <TabsTrigger value="percentage">
                    {dialogTranslations.types.percentage}
                  </TabsTrigger>
                  <TabsTrigger value="absolute">
                    {dialogTranslations.types.absolute}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="percentage" tabIndex={-1}>
                <div className="flex flex-row gap-big">
                  <FormField
                    control={form.control}
                    name="percentage.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.general.widthPercentage}
                        </FormLabel>
                        <FormControl>
                          <NumberInput {...field} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="percentage.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {translations.general.heightPercentage}
                        </FormLabel>
                        <FormControl>
                          <NumberInput {...field} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="absolute" tabIndex={-1}>
                <div className="flex flex-row gap-big justify-center sm:justify-start">
                  <FormField
                    control={form.control}
                    name="absolute.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.general.width}</FormLabel>
                        <FormControl>
                          <NumberInput {...field} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="absolute.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.general.height}</FormLabel>
                        <FormControl>
                          <NumberInput {...field} onChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="gap-medium flex flex-row justify-end">
              <Button disabled={isResizing} type="button" onClick={resize}>
                {translations.general.resize}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});

