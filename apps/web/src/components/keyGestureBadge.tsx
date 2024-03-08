import { KeyGesture } from "@/utils/keyGesture";

export const KeyGestureBadge = (props: { keyGesture: KeyGesture }) => {
  const { keyGesture } = props;
  return (
    <p className="text-sm text-muted-foreground">
      {keyGesture.toString()}
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>J
      </kbd>
    </p>
  );
};

