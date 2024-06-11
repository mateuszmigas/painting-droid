import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { useTypewriter } from "@/hooks";

const message =
  "Hello! Welcome to Painting Droid. Let’s configure a few settings to get you started on your creative journey.";

export const WelcomePage = () => {
  const typeWriter = useTypewriter(message);
  return (
    <div className="flex flex-col gap-big sm:flex-row relative sm:items-start items-center min-w-0">
      <div className="min-w-32">
        <Droid typingDurationSeconds={typeWriter.typingDurationSeconds}></Droid>
      </div>
      <Typewriter
        className="font-mono"
        text={message}
        typingDurationSeconds={typeWriter.typingDurationSeconds}
      ></Typewriter>
    </div>
  );
};

