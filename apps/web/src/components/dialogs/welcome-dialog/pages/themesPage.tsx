import { Droid } from "@/components/droid";
import { Typewriter } from "@/components/typewriter";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTypewriter } from "@/hooks";
const message =
  "Set your preferred theme. I can adapt to the system theme, or you can choose light or dark.";

export const ThemesPage = () => {
  const themes = ["system", "light", "dark"];
  const typewriter = useTypewriter(message);
  return (
    <div className="flex flex-col gap-big">
      <RadioGroup
        value={"system"}
        // onValueChange={setSelectedSize}
        className="grid grid-cols-3 gap-big"
      >
        {themes.map((theme) => (
          <div key={theme}>
            <RadioGroupItem value={theme} id={theme} className="peer sr-only" />
            <Label
              htmlFor={theme}
              className="flex flex-col gap-small items-center justify-between rounded-md border-2 border-muted bg-popover p-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="bg-blue-200 w-24 h-24"></div>
              <div>{theme}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
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

