import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { useTypewriter } from "@/hooks";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const message = translations.dialogs.welcome.pages.welcome.message;

export const WelcomePage = () => {
  const typeWriter = useTypewriter(message);
  return (
    <div className="flex flex-col gap-big sm:flex-row relative sm:items-start items-center min-w-0 text-center sm:text-start">
      <div className="min-w-32">
        <Droid typingDurationSeconds={typeWriter.typingDurationSeconds} />
      </div>
      <Typewriter className="font-mono" text={message} typingDurationSeconds={typeWriter.typingDurationSeconds} />
    </div>
  );
};
