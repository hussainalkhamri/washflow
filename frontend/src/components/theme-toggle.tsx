import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="button-theme-toggle"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-transform duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-500 transition-transform duration-300" />
      )}
      <span className="sr-only">تبديل المظهر</span>
    </Button>
  );
}
