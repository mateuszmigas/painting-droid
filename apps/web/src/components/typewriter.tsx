import { memo, useEffect, useState } from "react";

export const Typewriter = memo(
  (props: {
    text: string;
    typingDurationSeconds: number;
    className?: string;
  }) => {
    const { text, typingDurationSeconds, className } = props;
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const speed = (1000 * typingDurationSeconds) / text.length;

    useEffect(() => {
      if (index < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText + text[index]);
          setIndex(index + 1);
        }, speed);
        return () => clearTimeout(timeout);
      }
    }, [index, text, speed, displayedText]);

    return <div className={className}>{displayedText}</div>;
  }
);

