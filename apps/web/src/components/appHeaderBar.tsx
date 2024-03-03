import { ModeToggle } from "./themeToggle";
import { MenuBar } from "./menu-bar/menuBar";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { IconButton } from "./iconButton";
import { Button } from "./ui/button";
import { cn } from "@/utils/css";
import { useWorkspacesStore } from "@/store";

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
        "border-b-4 h-full text-sm hover:text-primary py-[6px] rounded-none",
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

export const AppHeaderBar = () => {
  const { workspaces, selectedWorkspaceIndex, addWorkspace } =
    useWorkspacesStore((state) => state);

  return (
    <div className="border-b flex flex-row justify-between items-center px-small gap-big">
      <MenuBar />
      <div className="flex-1 flex flex-row justify-center overflow-auto">
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
        <IconButton type="plus" size="medium" onClick={addWorkspace} />
      </div>
      <ModeToggle />
    </div>
  );
};

