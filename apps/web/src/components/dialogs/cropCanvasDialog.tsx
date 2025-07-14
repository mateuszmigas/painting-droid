import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBlobUrl, useCanvasActionDispatcher } from "@/hooks";
import { activeWorkspaceCanvasDataSelector, useWorkspacesStore } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { Rectangle, Size } from "@/utils/common";
import type { ImageCompressedData } from "@/utils/imageData";
import { ImageProcessor } from "@/utils/imageProcessor";
import { ImageAnchor, type ImageAnchorType } from "../image/imageAnchor";
import { ImageFit } from "../image/imageFit";
import { ImageOffset } from "../image/imageOffset";
import { NumberInput } from "../input/numberInput";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const dialogTranslations = getTranslations().dialogs.cropCanvas;
const translations = getTranslations();

type FormData = {
  percentage: { anchor: string; width: number; height: number };
  absolute: { anchor: string; width: number; height: number };
  offset: { left: number; top: number; right: number; bottom: number };
};

type CropType = "percentage" | "absolute" | "offset";

const calculateCrop = (formData: FormData, canvasSize: Size, cropType: CropType) => {
  if (cropType === "percentage" || cropType === "absolute") {
    const { anchor, width, height } = formData[cropType];
    const x = Math.round(cropType === "percentage" ? (canvasSize.width * width) / 100 : width);
    const y = Math.round(cropType === "percentage" ? (canvasSize.height * height) / 100 : height);

    if (anchor === "top-left") return { x: 0, y: 0, width: x, height: y };
    if (anchor === "top") return { x: (canvasSize.width - x) / 2, y: 0, width: x, height: y };
    if (anchor === "top-right") return { x: canvasSize.width - x, y: 0, width: x, height: y };
    if (anchor === "left") return { x: 0, y: (canvasSize.height - y) / 2, width: x, height: y };
    if (anchor === "center")
      return {
        x: Math.round((canvasSize.width - x) / 2),
        y: Math.round((canvasSize.height - y) / 2),
        width: x,
        height: y,
      };
    if (anchor === "right")
      return {
        x: Math.round(canvasSize.width - x),
        y: Math.round((canvasSize.height - y) / 2),
        width: x,
        height: y,
      };
    if (anchor === "bottom-left") return { x: 0, y: canvasSize.height - y, width: x, height: y };
    if (anchor === "bottom")
      return {
        x: Math.round((canvasSize.width - x) / 2),
        y: Math.round(canvasSize.height - y),
        width: x,
        height: y,
      };
    if (anchor === "bottom-right")
      return {
        x: Math.round(canvasSize.width - x),
        y: Math.round(canvasSize.height - y),
        width: x,
        height: y,
      };
  }

  const { top, left, right, bottom } = formData.offset;
  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(canvasSize.width - left - right),
    height: Math.round(canvasSize.height - top - bottom),
  };
};

const validateCrop = (crop: Rectangle, canvasSize: Size) => {
  if (crop.width <= 0 || crop.height <= 0) {
    return dialogTranslations.errors.tooSmall;
  }
  if (crop.x < 0 || crop.y < 0) {
    return dialogTranslations.errors.outOfBounds;
  }
  if (crop.x + crop.width > canvasSize.width) {
    return dialogTranslations.errors.outOfBounds;
  }
  if (crop.y + crop.height > canvasSize.height) {
    return dialogTranslations.errors.outOfBounds;
  }
  return null;
};

export const CropCanvasDialog = memo((props: { close: () => void }) => {
  const { close } = props;
  const canvasActionDispatcher = useCanvasActionDispatcher();
  const [selectedTab, setSelectedTab] = useState<CropType>("percentage");
  const canvasData = useWorkspacesStore((state) => activeWorkspaceCanvasDataSelector(state));
  const [imageData, setImageData] = useState<ImageCompressedData | null>(null);
  const imageDataUrl = useBlobUrl(imageData);
  const [isApplying, setIsApplying] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      percentage: { anchor: "top-left", width: 100, height: 100 },
      absolute: { anchor: "top-left", ...canvasData.size },
      offset: { left: 0, top: 0, right: 0, bottom: 0 },
    },
  });

  useEffect(() => {
    ImageProcessor.fromMergedCompressed(
      canvasData.layers.filter((layer) => layer.data).map((layer) => layer.data!),
      canvasData.size,
    )
      .toCompressedData()
      .then((data) => {
        setImageData(data);
      });
  }, [canvasData.layers, canvasData.size]);

  const apply = async () => {
    setIsApplying(true);
    await canvasActionDispatcher.execute("cropCanvas", { crop });
    close();
  };

  const crop = calculateCrop(form.watch(), canvasData.size, selectedTab);
  const error = validateCrop(crop, canvasData.size);

  return (
    <DialogContent style={{ minWidth: "fit-content" }}>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-big sm:flex-row relative sm:items-start items-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <ImageFit
              containerClassName="relative border box-content self-center overflow-hidden"
              imageClassName="alpha-background"
              originalImageSize={canvasData.size}
              containerSize={{ width: 320, height: 320 }}
              containerScale="cover"
              src={imageDataUrl}
              overlayNodeRenderer={() => (
                <div
                  style={{
                    visibility: error ? "hidden" : "visible",
                    width: `${(100 * crop.width) / canvasData.size.width}%`,
                    height: `${(100 * crop.height) / canvasData.size.height}%`,
                    left: `${(100 * crop.x) / canvasData.size.width}%`,
                    top: `${(100 * crop.y) / canvasData.size.height}%`,
                  }}
                  className="absolute border-2 border-dashed border-primary"
                />
              )}
            />
            <FormMessage className={error ? "text-destructive" : "text-primary"}>
              {error ? error : dialogTranslations.printCrop(crop)}
            </FormMessage>
          </div>
          <div className="flex h-full flex-col gap-big justify-between min-w-48">
            <Tabs value={selectedTab} onValueChange={setSelectedTab as (value: string) => void}>
              <div className="w-full flex justify-center">
                <TabsList>
                  <TabsTrigger value="percentage">{dialogTranslations.types.percentage}</TabsTrigger>
                  <TabsTrigger value="absolute">{dialogTranslations.types.absolute}</TabsTrigger>
                  <TabsTrigger value="offset">{dialogTranslations.types.offset}</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="percentage" tabIndex={-1}>
                <div className="flex flex-row gap-big">
                  <FormField
                    control={form.control}
                    name="percentage.anchor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.general.anchor}</FormLabel>
                        <ImageAnchor selectedAnchor={field.value as ImageAnchorType} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col items-center gap-medium">
                    <FormField
                      control={form.control}
                      name="percentage.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.general.widthPercentage}</FormLabel>
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
                          <FormLabel>{translations.general.heightPercentage}</FormLabel>
                          <FormControl>
                            <NumberInput {...field} onChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="absolute" tabIndex={-1}>
                <div className="flex flex-row gap-big justify-center sm:justify-start">
                  <FormField
                    control={form.control}
                    name="absolute.anchor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.general.anchor}</FormLabel>
                        <ImageAnchor selectedAnchor={field.value as ImageAnchorType} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col items-center gap-medium">
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
                </div>
              </TabsContent>
              <TabsContent value="offset" tabIndex={-1}>
                <div className="flex flex-row gap-big justify-center sm:justify-start">
                  <FormField
                    control={form.control}
                    name="offset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{translations.general.offsets}</FormLabel>
                        <ImageOffset offset={field.value} onChange={(e) => field.onChange(e)} />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="gap-medium flex flex-row justify-end">
              <Button disabled={!!error || isApplying} type="button" onClick={apply}>
                {translations.general.apply}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
});
