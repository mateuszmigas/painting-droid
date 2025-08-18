import { memo, useState } from "react";
import { defaultCanvasColor } from "@/constants";
import { useWorkspacesStore, type WorkspaceId } from "@/store/workspacesStore";
import { getTranslations } from "@/translations";
import type { Color } from "@/utils/common";
import { ColorButton } from "../color/colorButton";
import { ColorPicker } from "../color/colorPicker";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const translations = getTranslations();
const dialogTranslations = translations.dialogs.editWorkspace;

export const EditWorkspaceDialog = memo((props: { workspaceId: WorkspaceId; close: () => void }) => {
  const { workspaceId, close } = props;
  const { workspaces, editWorkspace } = useWorkspacesStore();
  const workspace = workspaces.find((w) => w.id === workspaceId)!;
  const [name, setName] = useState(workspace.name);
  const [color, setColor] = useState<Color>(workspace.canvasData.baseColor || defaultCanvasColor);
  const [backgroundType, setBackgroundType] = useState<"none" | "solid">(
    workspace.canvasData.baseColor ? "solid" : "none",
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{dialogTranslations.title}</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-big"
        onSubmit={(e) => {
          e.preventDefault();
          editWorkspace(workspaceId, name, backgroundType === "solid" ? color : null);
          close();
        }}
      >
        <div className="flex flex-row gap-big">
          <div className="flex flex-col gap-form-field-big flex-1">
            <Label>{dialogTranslations.fields.name}</Label>
            <Input
              autoFocus
              placeholder={translations.general.untitled}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-form-field-big">
            <Label>{dialogTranslations.fields.background.name}</Label>
            <div className="flex flex-row gap-medium">
              <RadioGroup
                value={backgroundType}
                onValueChange={(value) => setBackgroundType(value as never)}
                className="h-input-thick flex gap-big"
              >
                <div className="flex items-center gap-small">
                  {/** biome-ignore lint/correctness/useUniqueElementIds: checked */}
                  <RadioGroupItem value="none" id="radio-none" />
                  <Label htmlFor="radio-none">{dialogTranslations.fields.background.options.none}</Label>
                </div>
                <div className="flex items-center gap-small">
                  {/** biome-ignore lint/correctness/useUniqueElementIds: checked */}
                  <RadioGroupItem value="solid" id="radio-solid-color" />
                  <Label htmlFor="radio-solid-color">{dialogTranslations.fields.background.options.solid}</Label>
                </div>
              </RadioGroup>
              {backgroundType === "solid" ? (
                <ColorPicker
                  value={color}
                  onChange={setColor}
                  title={dialogTranslations.fields.background.title}
                  className="h-input-thick w-input-thick"
                />
              ) : (
                <ColorButton
                  disabled
                  className="h-input-thick w-input-thick disabled:opacity-100"
                  color={{ r: 0, g: 0, b: 0, a: 0 }}
                  variant="ghost"
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{translations.general.update}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});
