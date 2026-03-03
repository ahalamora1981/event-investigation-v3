import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../styles/themes';

export function useThemeStyles() {
  const { theme } = useTheme();
  return themes[theme];
}
