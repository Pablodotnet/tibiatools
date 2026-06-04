import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Theme, useTheme } from "../theme-provider";
import { useTranslation } from 'react-i18next';

export function ModeToggle() {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("vite-ui-theme") as Theme) || "light";
    setCurrentTheme(savedTheme);
    setTheme(savedTheme);
  }, [setTheme]);

  const handleToggle = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("vite-ui-theme", newTheme);
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <Button
      className='cursor-pointer'
      variant='outline'
      size='icon'
      onClick={handleToggle}
      aria-label={t('theme.toggle')}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' data-icon />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' data-icon />
      <span className='sr-only'>{t('theme.toggle')}</span>
    </Button>
  );
}
