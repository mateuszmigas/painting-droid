import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { memo, useState } from "react";
import { scaleRectangleToFitParent, type Size } from "@/utils/common";
import { demoModel } from "@/models/server/demo";
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
import type { ImageCompressedData } from "@/utils/imageData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { uuid } from "@/utils/uuid";

const FormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  model: z.string(),
  size: z.string(),
});

const availableSizes = demoModel.availableSizes.map((size) => {
  return { id: uuid(), width: size.width, height: size.height };
});

export const GenerateImageDialog = memo(
  (props: {
    close: (result: { data: ImageCompressedData | null }) => void;
  }) => {
    const { close } = props;

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        prompt: "a cat with a nice hat",
        model: "demo",
        size: availableSizes[0].id,
      },
    });
    const [isFetching, setIsFetching] = useState(false);
    const [imgData, setImgData] = useState<string>("");

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setIsFetching(true);

      const size = availableSizes.findIndex(
        (size) => size.id === form.watch("size")
      );

      demoModel
        .request(data.prompt, availableSizes[size])
        .then((img) => {
          setImgData(`data:image/png;base64,${img}`);
          setIsFetching(false);
        })
        .catch((err) => {
          form.setError("prompt", { message: err.toString() });
          setIsFetching(false);
        });
    }

    const currentSize = availableSizes[
      availableSizes.findIndex((size) => size.id === form.watch("size"))
    ] as Size;
    const { scale } = scaleRectangleToFitParent(
      { x: 0, y: 0, ...currentSize },
      { width: 460, height: 460 },
      1
    );
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-big"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center justify-center gap-big size-full">
              <div
                style={{
                  width: `${currentSize.width * scale}px`,
                  height: `${currentSize.height * scale}px`,
                }}
                className="border-primary border-2 border-dashed object-contain box-content"
              >
                {imgData && (
                  <img
                    className="size-full object-contain"
                    src={imgData}
                    alt=""
                  />
                )}
              </div>
            </div>
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
            <DialogFooter>
              <Button type="submit" variant="secondary" disabled={isFetching}>
                {imgData ? "Regenerate" : "Generate"}
                {isFetching ? (
                  <Icon
                    className="ml-2 animate-spin"
                    type="loader"
                    size="small"
                  />
                ) : (
                  <Icon
                    className="ml-2"
                    type={imgData ? "check" : "brain"}
                    size="small"
                  />
                )}
              </Button>
              <Button
                type="button"
                onClick={() =>
                  close({
                    data: imgData ? { data: imgData, ...currentSize } : null,
                  })
                }
                disabled={!imgData}
              >
                Apply
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    );
  }
);