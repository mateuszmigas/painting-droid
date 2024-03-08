import { ModeToggle } from "../themeToggle";
import { MenuBar } from "../menu-bar/menuBar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useCommandPaletteStore, useWorkspacesStore } from "@/store";
import { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { IconButton } from "../iconButton";

export const AppHeaderBar = memo(() => {
  const {
    workspaces,
    selectedWorkspaceId,
    selectWorkspace,
    addNewActiveWorkspace,
  } = useWorkspacesStore((state) => state);
  const { setIsOpen } = useCommandPaletteStore((store) => store);

  return (
    <div className="border-b flex flex-row justify-between items-center px-small gap-big">
      <MenuBar />
      <div className="flex-1 flex flex-row justify-center overflow-auto items-center gap-small">
        <ScrollArea className="whitespace-nowrap">
          <Tabs value={selectedWorkspaceId} onValueChange={selectWorkspace}>
            <TabsList className="bg-transparent p-0">
              {workspaces.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-4 border-b-transparent px-big pb-1 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <IconButton
          type="plus"
          size="small-medium"
          onClick={addNewActiveWorkspace}
        />
      </div>
      <div className="flex flex-row justify-center items-center pr-small gap-small">
        <IconButton
          type="command"
          size="small"
          onClick={() => setIsOpen(true)}
        />
        <ModeToggle />
      </div>
    </div>
  );
});

