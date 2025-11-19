import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Theme, useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export function ToggleThemeButton() {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setCurrentTheme(savedTheme);
    setTheme(savedTheme); // Apply the saved theme
  }, [setTheme]);

  const handleToggle = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
export default ToggleThemeButton;
