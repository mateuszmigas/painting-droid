import { ConfigureModels } from "@/components/configure-models/configureModels";
import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { useTypewriter } from "@/hooks";

const message =
  "I can use various AI models to assist you. This is the default list, but you can add your own. API key models are desktop-only. Check the documentation for self-hosting.";

export const ModelsPage = () => {
  const typewriter = useTypewriter(message);
  return (
    <div className="flex flex-col gap-big">
      <div className="max-h-[400px]">
        <ConfigureModels showDesktopVersionInfo={false} />
      </div>
      <div className="flex flex-row gap-big items-center">
        <div className="max-w-12 min-w-12">
          <Droid
            typingDurationSeconds={typewriter.typingDurationSeconds}
          ></Droid>
        </div>
        <Typewriter
          className="font-mono text-sm"
          text={message}
          typingDurationSeconds={typewriter.typingDurationSeconds}
        ></Typewriter>
      </div>
    </div>
  );
};

