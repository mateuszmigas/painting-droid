import { ModeToggle } from "../themeToggle";
import { MenuBar } from "../menu-bar/menuBar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useWorkspacesStore } from "@/store";
import { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { IconButton } from "../iconButton";
import { CommandIconButton } from "../commandIconButton";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";

export const AppHeaderBar = memo(() => {
  const {
    workspaces,
    selectedWorkspaceId,
    selectWorkspace,
    addNewActiveWorkspace,
    closeWorkspace,
  } = useWorkspacesStore((state) => state);
  return (
    <div className="border-b flex flex-row justify-between items-center px-small gap-big">
      <MenuBar />
      <div className="flex-1 flex flex-row justify-center overflow-auto items-center gap-small">
        <ScrollArea className="whitespace-nowrap">
          <Tabs value={selectedWorkspaceId} onValueChange={selectWorkspace}>
            <TabsList className="bg-transparent p-0">
              {workspaces.map((tab) => (
                <ContextMenu key={tab.id}>
                  <ContextMenuTrigger>
                    <TabsTrigger
                      value={tab.id}
                      className="rounded-none border-b-4 border-b-transparent px-big pb-1 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      {tab.name}
                    </TabsTrigger>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => closeWorkspace(tab.id)}>
                      Close
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
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
        <CommandIconButton commandId="openCommandPalette" />
        <ModeToggle />
      </div>
    </div>
  );
});
