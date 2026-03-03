import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const styles = useThemeStyles();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 border ${styles.header.buttonBorder} rounded-lg ${styles.header.buttonBg} ${styles.header.buttonText} ${styles.header.buttonHover} transition-colors`}
      title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

export default ThemeToggle;
