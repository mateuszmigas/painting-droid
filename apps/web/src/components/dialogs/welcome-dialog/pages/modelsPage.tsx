import { ConfigureModels } from "@/components/configure-models/configureModels";
import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { useTypewriter } from "@/hooks";
import { getTranslations } from "@/translations";
const translations = getTranslations();

const message = translations.dialogs.welcome.pages.models.message;

export const ModelsPage = () => {
  const typewriter = useTypewriter(message);
  return (
    <div className="flex flex-col gap-big">
      <div className="max-h-96">
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
