import { ModeToggle } from "./themeToggle";
import { MenuBar } from "./menu-bar/menuBar";

export const AppHeaderBar = () => {
  return (
    <div className="border-b flex flex-row justify-between items-center px-2">
      <MenuBar />
      <ModeToggle />
    </div>
  );
};

