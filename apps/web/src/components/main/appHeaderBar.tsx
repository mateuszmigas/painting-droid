import { ModeToggle } from "../themeToggle";
import { CustomMenuBar } from "../menu-bar/customMenuBar";
import { NativeMenuBarProxy } from "../menu-bar/nativeMenuBarProxy";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useWorkspacesStore } from "@/store";
import { memo, useLayoutEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { IconButton } from "../icons/iconButton";
import { CommandIconButton } from "../commandIconButton";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";
import { IconAnchor } from "../icons/iconAnchor";
import { useCommandService } from "@/contexts/commandService";
import { Separator } from "../ui/separator";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { features } from "@/contants";

const compactThreshold = 640;

export const AppHeaderBar = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [compactMenuBar, setCompactMenuBar] = useState<boolean>(false);
  const { workspaces, activeWorkspaceId, selectWorkspace, closeWorkspace } =
    useWorkspacesStore((state) => state);
  const { executeCommand } = useCommandService();

  useLayoutEffect(() => {
    if (containerRef.current) {
      setCompactMenuBar(containerRef.current.clientWidth < compactThreshold);
    }
  }, []);

  useResizeObserver(containerRef, ({ width }) => {
    setCompactMenuBar(width < compactThreshold);
  });

  return (
    <div
      ref={containerRef}
      className="border-b flex flex-row justify-between items-center px-small"
    >
      {features.customMenuBar ? (
        <>
          <CustomMenuBar compact={compactMenuBar} />
          <Separator
            orientation="vertical"
            className="h-6 w-px bg-border mx-1"
          />
        </>
      ) : (
        <NativeMenuBarProxy />
      )}

      <div className="ml-medium flex-1 flex flex-row justify-start overflow-auto items-center gap-small">
        <ScrollArea className="whitespace-nowrap">
          <Tabs value={activeWorkspaceId} onValueChange={selectWorkspace}>
            <TabsList className="bg-transparent p-0">
              {workspaces.map((tab) => (
                <ContextMenu key={tab.id}>
                  <ContextMenuTrigger>
                    <TabsTrigger
                      value={tab.id}
                      onMouseDown={(e) =>
                        e.button === 1 && closeWorkspace(tab.id)
                      }
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
          onClick={() => executeCommand("newActiveWorkspace")}
        />
      </div>
      <Separator orientation="vertical" className="h-6 w-px bg-border mx-1" />
      <div className="flex flex-row justify-center items-center pr-small gap-small">
        <CommandIconButton commandId="openSettingsDialog" />
        <IconAnchor
          type="bug"
          size="small"
          href="https://github.com/mateuszmigas/painting-droid/issues"
        />
        <IconAnchor
          type="github"
          size="small"
          href="https://github.com/mateuszmigas/painting-droid"
        />
        <CommandIconButton commandId="openCommandPalette" />
        <ModeToggle />
      </div>
    </div>
  );
});

