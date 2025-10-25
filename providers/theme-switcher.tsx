"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Palette, Check, Sparkles } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.className = theme;
  }, [theme]);

  // Get the actual active theme (accounting for system preference)
  const activeTheme = theme === "system" ? systemTheme : theme;

  const themes = [
    {
      key: "light",
      name: "Light",
      icon: Sun,
      description: "Bright and clear",
    },
    {
      key: "dark",
      name: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      key: "system",
      name: "System",
      icon: Monitor,
      description: "Auto-adjust",
    },
  ];

  // Dynamic button icon based on active theme
  const ButtonIcon = () => {
    if (!mounted) return <Palette className="h-5 w-5" />;

    switch (activeTheme) {
      case "light":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  if (!mounted) {
    return (
      <Button
        size="icon"
        variant="outline"
        aria-label="Change theme"
        disabled
        className="relative overflow-hidden"
      >
        <Palette className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Change theme"
          className="relative overflow-hidden transition-all duration-200 hover:scale-105"
        >
          <div className="transition-transform duration-300">
            <ButtonIcon />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.key;

          return (
            <DropdownMenuItem
              key={t.key}
              onClick={() => {
                setTheme(t.key);
                // Optional: close dropdown after selection
                setTimeout(() => setIsOpen(false), 150);
              }}
              className={`cursor-pointer transition-colors ${
                isActive ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive
                        ? t.key === "light"
                          ? "text-amber-500"
                          : t.key === "dark"
                          ? "text-blue-400"
                          : "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className={isActive ? "font-semibold" : ""}>
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.description}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <Check className="h-4 w-4 text-primary animate-in fade-in zoom-in duration-200" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
