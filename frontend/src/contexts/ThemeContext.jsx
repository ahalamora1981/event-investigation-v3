import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  const [contentTheme, setContentTheme] = useState(() => {
    const saved = localStorage.getItem('contentTheme');
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    console.log('Current theme:', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('contentTheme', contentTheme);
    console.log('Current content theme:', contentTheme);
  }, [contentTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('Switching to theme:', newTheme);
      return newTheme;
    });
  };

  const toggleContentTheme = () => {
    setContentTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('Switching to content theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, contentTheme, toggleContentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
