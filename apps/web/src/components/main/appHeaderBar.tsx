import { ModeToggle } from "../themeToggle";
import { MenuBar } from "../menu-bar/menuBar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { cn } from "@/utils/css";
import { useWorkspacesStore } from "@/store";
import { memo } from "react";

const WorkspaceTab = (props: {
  index: number;
  name: string;
  isSelected: boolean;
}) => {
  const { index, name, isSelected } = props;
  const selectWorkspace = useWorkspacesStore((state) => state.selectWorkspace);

  return (
    <Button
      className={cn(
        "border-b-4 h-8 text-sm hover:text-primary pt-1 rounded-none",
        isSelected ? "border-primary" : "border-transparent"
      )}
      variant="ghost"
      size="sm"
      onClick={() => selectWorkspace(index)}
    >
      {name}
    </Button>
  );
};

export const AppHeaderBar = memo(() => {
  const { workspaces, selectedWorkspaceIndex } = useWorkspacesStore(
    (state) => state
  );

  return (
    <div className="border-b flex flex-row justify-between items-center px-small gap-big">
      <MenuBar />
      <div className="flex-1 flex flex-row justify-center overflow-auto items-center">
        <ScrollArea className="whitespace-nowrap">
          <div className="h-full flex-row flex items-center">
            {workspaces.map((tab, index) => (
              <WorkspaceTab
                key={tab.id}
                index={index}
                name={tab.name}
                isSelected={index === selectedWorkspaceIndex}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* <IconButton type="plus" size="medium" onClick={addWorkspace} /> */}
      </div>
      <ModeToggle />
    </div>
  );
});

