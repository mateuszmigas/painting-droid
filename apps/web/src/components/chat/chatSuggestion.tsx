import { memo } from "react";

export const ChatSuggestion = memo((props: { suggestion: string; onClick: () => void }) => {
  const { suggestion, onClick } = props;
  return (
    <button
      onClick={onClick}
      type="button"
      key={suggestion}
      className="rounded-lg text-sm py-small px-medium border self-end"
    >
      {suggestion}
    </button>
  );
});
