import { memo, type RefObject, useLayoutEffect, useRef, useState } from "react";
import { domNames } from "@/constants";
import { useCommandService } from "@/contexts/commandService";
import { features } from "@/features";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useWorkspacesStore } from "@/store";
import { getTranslations } from "@/translations";
import { CommandIconButton } from "../commandIconButton";
import { IconAnchor } from "../icons/iconAnchor";
import { CustomMenuBar } from "../menu-bar/customMenuBar";
import { NativeMenuBarProxy } from "../menu-bar/nativeMenuBarProxy";
import { ModeToggle } from "../themeToggle";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const translations = getTranslations();

const compactThreshold = 640;

export const AppHeaderBar = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [compactMenuBar, setCompactMenuBar] = useState<boolean>(false);
  const { workspaces, activeWorkspaceId, selectWorkspace, closeWorkspace } = useWorkspacesStore((state) => state);
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
    <div ref={containerRef} className="border-b flex flex-row justify-between items-center px-small">
      {features.nativeMenuBar ? (
        <NativeMenuBarProxy />
      ) : (
        <>
          <CustomMenuBar compact={compactMenuBar} />
          <Separator orientation="vertical" className="h-6 w-px bg-border mx-1" />
        </>
      )}
      <div className="ml-medium flex-1 overflow-auto">
        <ScrollArea className="whitespace-nowrap">
          <div className="flex flex-row">
            <Tabs value={activeWorkspaceId} onValueChange={selectWorkspace}>
              <TabsList className="bg-transparent p-0">
                {workspaces.map((tab) => (
                  <ContextMenu key={tab.id}>
                    <ContextMenuTrigger>
                      <TabsTrigger
                        aria-controls={domNames.workspaceViewport}
                        value={tab.id}
                        onMouseDown={(e) => e.button === 1 && closeWorkspace(tab.id)}
                        className="rounded-none border-b-4 border-b-transparent px-big pb-1 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                      >
                        {tab.name}
                      </TabsTrigger>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onSelect={() =>
                          executeCommand("editWorkspace", {
                            workspaceId: tab.id,
                          })
                        }
                      >
                        {translations.general.edit}
                      </ContextMenuItem>
                      {workspaces.length > 1 && (
                        <ContextMenuItem onSelect={() => closeWorkspace(tab.id)}>
                          {translations.general.close}
                        </ContextMenuItem>
                      )}
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </TabsList>
            </Tabs>
            <CommandIconButton commandId="createActiveWorkspace" icon="plus" size="small-medium" />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator orientation="vertical" className="h-6 w-px bg-border mx-1" />
      <div className="flex flex-row justify-center items-center pr-small gap-small">
        <CommandIconButton commandId="shareWorkspace" />
        <IconAnchor
          type="help"
          size="small"
          href="https://mateusz-migas.gitbook.io/painting-droid-docs"
          title={translations.links.help}
        />
        <IconAnchor
          type="bug"
          size="small"
          href="https://github.com/mateuszmigas/painting-droid/issues"
          title={translations.links.reportIssue}
        />
        <IconAnchor
          type="github"
          size="small"
          href="https://github.com/mateuszmigas/painting-droid"
          title={translations.links.viewSource}
        />
        <IconAnchor
          type="github"
          size="small"
          href="https://github.com/mateuszmigas/painting-droid"
          title={translations.links.viewSource}
        />
        <CommandIconButton commandId="openCommandPalette" />
        <ModeToggle />
        <CommandIconButton commandId="openSettingsDialog" />
      </div>
    </div>
  );
});
